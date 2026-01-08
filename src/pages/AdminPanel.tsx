/**
 * لوحة تحكم المدير
 * تعرض الإحصائيات وإدارة المستخدمين والمشاريع
 */

import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { getCurrentUser, signOut } from '@/firebase/firebase.auth';
import { queryCollection, getCollectionCount } from '@/firebase/firebase.db';
import { getAIKeys, saveAIKey, deleteAIKey, type AIKey } from '@/services/aiKeysService';
import { toast } from '@/hooks/use-toast';
import { 
  Users, FolderOpen, LogOut, Key, Shield, 
  ArrowRight, Database, Activity, AlertCircle, Trash2, Save, Loader2, Eye, EyeOff
} from 'lucide-react';
import { t } from '@/i18n';
import type { Project, NtflyUser } from '@/types/global.d';

// إعدادات Firebase
function FirebaseSettings() {
  const [apiKey, setApiKey] = useState('');
  const [authDomain, setAuthDomain] = useState('');
  const [projectId, setProjectId] = useState('');
  const [storageBucket, setStorageBucket] = useState('');
  const [messagingSenderId, setMessagingSenderId] = useState('');
  const [appId, setAppId] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSave = () => {
    setSaving(true);
    const config = { apiKey, authDomain, projectId, storageBucket, messagingSenderId, appId };
    localStorage.setItem('ntfly_firebase_config', JSON.stringify(config));
    setTimeout(() => {
      setSaving(false);
      toast({
        title: 'تم الحفظ',
        description: 'تم حفظ إعدادات Firebase. أعد تحميل الصفحة لتطبيق التغييرات.',
      });
    }, 500);
  };

  useEffect(() => {
    try {
      const saved = localStorage.getItem('ntfly_firebase_config');
      if (saved) {
        const config = JSON.parse(saved);
        setApiKey(config.apiKey || '');
        setAuthDomain(config.authDomain || '');
        setProjectId(config.projectId || '');
        setStorageBucket(config.storageBucket || '');
        setMessagingSenderId(config.messagingSenderId || '');
        setAppId(config.appId || '');
      }
    } catch {}
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5" />
          إعدادات Firebase
        </CardTitle>
        <CardDescription>
          أدخل مفاتيح Firebase لتفعيل الميزات الكاملة
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label>API Key</Label>
            <Input type="password" value={apiKey} onChange={(e) => setApiKey(e.target.value)} placeholder="AIza..." />
          </div>
          <div className="space-y-2">
            <Label>Auth Domain</Label>
            <Input value={authDomain} onChange={(e) => setAuthDomain(e.target.value)} placeholder="project.firebaseapp.com" />
          </div>
          <div className="space-y-2">
            <Label>Project ID</Label>
            <Input value={projectId} onChange={(e) => setProjectId(e.target.value)} placeholder="my-project" />
          </div>
          <div className="space-y-2">
            <Label>Storage Bucket</Label>
            <Input value={storageBucket} onChange={(e) => setStorageBucket(e.target.value)} placeholder="project.appspot.com" />
          </div>
          <div className="space-y-2">
            <Label>Messaging Sender ID</Label>
            <Input value={messagingSenderId} onChange={(e) => setMessagingSenderId(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>App ID</Label>
            <Input value={appId} onChange={(e) => setAppId(e.target.value)} />
          </div>
        </div>
        <Button onClick={handleSave} disabled={saving}>
          {saving ? <Loader2 className="h-4 w-4 animate-spin ml-2" /> : <Save className="h-4 w-4 ml-2" />}
          حفظ الإعدادات
        </Button>
      </CardContent>
    </Card>
  );
}

// إعدادات AI محسّنة
function AISettings() {
  const [keys, setKeys] = useState<{ gemini: string; openai: string; claude: string }>({
    gemini: '',
    openai: '',
    claude: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [showKeys, setShowKeys] = useState<{ gemini: boolean; openai: boolean; claude: boolean }>({
    gemini: false,
    openai: false,
    claude: false
  });

  useEffect(() => {
    loadKeys();
  }, []);

  const loadKeys = async () => {
    try {
      setLoading(true);
      const savedKeys = await getAIKeys();
      const keyMap = { gemini: '', openai: '', claude: '' };
      
      savedKeys.forEach(k => {
        if (k.provider in keyMap) {
          keyMap[k.provider as keyof typeof keyMap] = k.key;
        }
      });
      
      setKeys(keyMap);
    } catch (error) {
      console.error('خطأ في تحميل المفاتيح:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (provider: 'gemini' | 'openai' | 'claude') => {
    const key = keys[provider];
    if (!key.trim()) {
      toast({
        title: 'خطأ',
        description: 'الرجاء إدخال المفتاح',
        variant: 'destructive'
      });
      return;
    }

    setSaving(provider);
    try {
      const success = await saveAIKey(provider, key);
      if (success) {
        toast({
          title: 'تم الحفظ',
          description: `تم حفظ مفتاح ${provider.toUpperCase()} بنجاح`,
        });
      } else {
        throw new Error('فشل الحفظ');
      }
    } catch (error) {
      toast({
        title: 'خطأ',
        description: 'فشل في حفظ المفتاح',
        variant: 'destructive'
      });
    } finally {
      setSaving(null);
    }
  };

  const handleDelete = async (provider: 'gemini' | 'openai' | 'claude') => {
    setSaving(provider);
    try {
      const success = await deleteAIKey(provider);
      if (success) {
        setKeys(prev => ({ ...prev, [provider]: '' }));
        toast({
          title: 'تم الحذف',
          description: `تم حذف مفتاح ${provider.toUpperCase()}`,
        });
      }
    } catch (error) {
      toast({
        title: 'خطأ',
        description: 'فشل في حذف المفتاح',
        variant: 'destructive'
      });
    } finally {
      setSaving(null);
    }
  };

  const toggleShowKey = (provider: 'gemini' | 'openai' | 'claude') => {
    setShowKeys(prev => ({ ...prev, [provider]: !prev[provider] }));
  };

  const renderKeyInput = (
    provider: 'gemini' | 'openai' | 'claude',
    label: string,
    placeholder: string
  ) => (
    <div className="space-y-2 p-4 border rounded-lg">
      <Label className="text-base font-semibold">{label}</Label>
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Input
            type={showKeys[provider] ? 'text' : 'password'}
            value={keys[provider]}
            onChange={(e) => setKeys(prev => ({ ...prev, [provider]: e.target.value }))}
            placeholder={placeholder}
            className="pr-10"
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute left-2 top-1/2 -translate-y-1/2 h-7 w-7 p-0"
            onClick={() => toggleShowKey(provider)}
          >
            {showKeys[provider] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </Button>
        </div>
        <Button 
          onClick={() => handleSave(provider)} 
          disabled={saving === provider || !keys[provider].trim()}
          size="sm"
        >
          {saving === provider ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
        </Button>
        {keys[provider] && (
          <Button 
            onClick={() => handleDelete(provider)} 
            disabled={saving === provider}
            variant="destructive"
            size="sm"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </div>
      {keys[provider] && (
        <p className="text-xs text-green-600 dark:text-green-400">✓ المفتاح محفوظ</p>
      )}
    </div>
  );

  if (loading) {
    return (
      <Card>
        <CardContent className="py-12 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Key className="h-5 w-5" />
          مفاتيح الذكاء الاصطناعي
        </CardTitle>
        <CardDescription>
          أدخل مفاتيح API للخدمات الخارجية (يتم تخزينها بشكل مشفر)
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
          <p className="text-sm text-yellow-600 dark:text-yellow-400">
            💡 إذا لم تدخل أي مفاتيح، سيتم استخدام نظام الذكاء المحلي لتوليد المواقع.
          </p>
        </div>
        
        <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
          <p className="text-sm text-blue-600 dark:text-blue-400">
            🔒 المفاتيح تُخزن مشفرة ولا يمكن للمستخدمين العاديين رؤيتها أو الوصول إليها.
          </p>
        </div>

        <div className="space-y-4 mt-6">
          {renderKeyInput('gemini', 'Google Gemini API Key', 'AIza...')}
          {renderKeyInput('openai', 'OpenAI API Key', 'sk-...')}
          {renderKeyInput('claude', 'Anthropic Claude API Key', 'sk-ant-...')}
        </div>
      </CardContent>
    </Card>
  );
}

export default function AdminPanel() {
  const user = getCurrentUser();
  const navigate = useNavigate();
  
  const [stats, setStats] = useState({
    users: 0,
    projects: 0,
    completed: 0,
    failed: 0,
  });
  
  const [users, setUsers] = useState<NtflyUser[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    // تحميل الإحصائيات
    Promise.all([
      getCollectionCount('users'),
      getCollectionCount('projects'),
      queryCollection<Project>('projects', [{ field: 'status', operator: '==', value: 'completed' }]),
      queryCollection<Project>('projects', [{ field: 'status', operator: '==', value: 'failed' }]),
    ]).then(([usersCount, projectsCount, completedProjects, failedProjects]) => {
      setStats({
        users: usersCount,
        projects: projectsCount,
        completed: completedProjects.length,
        failed: failedProjects.length,
      });
    });

    // تحميل المستخدمين والمشاريع
    queryCollection<NtflyUser>('users', [], { limit: 20 }).then(setUsers);
    queryCollection<Project>('projects', [], { orderBy: 'createdAt', orderDirection: 'desc', limit: 20 }).then(setProjects);
  }, []);

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container-rtl flex h-16 items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-bold text-gradient">Ntfly Admin</h1>
            <span className="px-2 py-1 text-xs bg-primary/10 text-primary rounded">
              <Shield className="h-3 w-3 inline ml-1" />
              مدير
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            <Link to="/dashboard">
              <Button variant="outline" size="sm">
                <ArrowRight className="h-4 w-4 ml-2" />
                لوحة المستخدم
              </Button>
            </Link>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4 ml-2" />
              خروج
            </Button>
          </div>
        </div>
      </header>

      <main className="container-rtl py-8">
        {/* إحصائيات */}
        <div className="grid gap-4 md:grid-cols-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">المستخدمين</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.users}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">المشاريع</CardTitle>
              <FolderOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.projects}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">مكتملة</CardTitle>
              <Activity className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-500">{stats.completed}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">فاشلة</CardTitle>
              <AlertCircle className="h-4 w-4 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-destructive">{stats.failed}</div>
            </CardContent>
          </Card>
        </div>

        {/* تبويبات */}
        <Tabs defaultValue="users" className="space-y-4">
          <TabsList>
            <TabsTrigger value="users">المستخدمين</TabsTrigger>
            <TabsTrigger value="projects">المشاريع</TabsTrigger>
            <TabsTrigger value="firebase">Firebase</TabsTrigger>
            <TabsTrigger value="ai">الذكاء الاصطناعي</TabsTrigger>
          </TabsList>

          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle>قائمة المستخدمين</CardTitle>
              </CardHeader>
              <CardContent>
                {users.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">لا يوجد مستخدمين</p>
                ) : (
                  <div className="space-y-2">
                    {users.map(u => (
                      <div key={u.uid} className="p-4 border rounded-lg flex justify-between items-center">
                        <div>
                          <p className="font-medium">{u.displayName || u.email}</p>
                          <p className="text-sm text-muted-foreground">{u.email}</p>
                        </div>
                        <span className={`px-2 py-1 text-xs rounded ${u.role === 'admin' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                          {u.role === 'admin' ? 'مدير' : 'مستخدم'}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="projects">
            <Card>
              <CardHeader>
                <CardTitle>قائمة المشاريع</CardTitle>
              </CardHeader>
              <CardContent>
                {projects.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">لا توجد مشاريع</p>
                ) : (
                  <div className="space-y-2">
                    {projects.map(p => (
                      <div key={p.id} className="p-4 border rounded-lg flex justify-between items-center">
                        <div>
                          <p className="font-medium">{p.name}</p>
                          <p className="text-sm text-muted-foreground">{p.template} • {new Date(p.createdAt).toLocaleDateString('ar')}</p>
                        </div>
                        <span className={`px-2 py-1 text-xs rounded ${
                          p.status === 'completed' ? 'bg-green-500/20 text-green-600' :
                          p.status === 'failed' ? 'bg-destructive/20 text-destructive' :
                          'bg-yellow-500/20 text-yellow-600'
                        }`}>
                          {t(`projects.${p.status}`)}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="firebase">
            <FirebaseSettings />
          </TabsContent>

          <TabsContent value="ai">
            <AISettings />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
