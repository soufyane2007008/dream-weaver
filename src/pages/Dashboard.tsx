/**
 * لوحة التحكم الرئيسية للمستخدم
 * تعرض المشاريع والإحصائيات السريعة
 */

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getCurrentUser, signOut } from '@/firebase/firebase.auth';
import { queryCollection } from '@/firebase/firebase.db';
import { useNavigate } from 'react-router-dom';
import { Plus, FolderOpen, LogOut, Settings, User } from 'lucide-react';
import { t } from '@/i18n';
import type { Project } from '@/types/global.d';

export default function Dashboard() {
  const user = getCurrentUser();
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    if (user) {
      queryCollection<Project>('projects', [
        { field: 'ownerId', operator: '==', value: user.uid }
      ], { orderBy: 'createdAt', orderDirection: 'desc', limit: 5 })
        .then(setProjects);
    }
  }, [user]);

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container-rtl flex h-16 items-center justify-between">
          <h1 className="text-xl font-bold text-gradient">Ntfly</h1>
          
          <div className="flex items-center gap-2">
            {user?.role === 'admin' && (
              <Link to="/admin">
                <Button variant="outline" size="sm">
                  <Settings className="h-4 w-4 ml-2" />
                  {t('nav.admin')}
                </Button>
              </Link>
            )}
            
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4 ml-2" />
              {t('auth.logout')}
            </Button>
          </div>
        </div>
      </header>

      <main className="container-rtl py-8">
        {/* Welcome */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-2">
            {t('dashboard.welcome')}، {user?.displayName || user?.email}
          </h2>
          <p className="text-muted-foreground">إدارة مشاريعك وإنشاء مواقع جديدة</p>
        </div>

        {/* Quick Actions */}
        <div className="grid gap-4 md:grid-cols-3 mb-8">
          <Card className="card-featured cursor-pointer hover:border-primary" onClick={() => {}}>
            <CardHeader className="flex flex-row items-center gap-4">
              <div className="p-2 rounded-lg bg-primary/10">
                <Plus className="h-6 w-6 text-primary" />
              </div>
              <div>
                <CardTitle className="text-lg">{t('dashboard.createProject')}</CardTitle>
                <CardDescription>ابدأ مشروعاً جديداً</CardDescription>
              </div>
            </CardHeader>
          </Card>
          
          <Card className="card-featured">
            <CardHeader className="flex flex-row items-center gap-4">
              <div className="p-2 rounded-lg bg-secondary/10">
                <FolderOpen className="h-6 w-6 text-secondary" />
              </div>
              <div>
                <CardTitle className="text-lg">{projects.length}</CardTitle>
                <CardDescription>مشاريعك</CardDescription>
              </div>
            </CardHeader>
          </Card>
          
          <Card className="card-featured">
            <CardHeader className="flex flex-row items-center gap-4">
              <div className="p-2 rounded-lg bg-accent/10">
                <User className="h-6 w-6 text-accent" />
              </div>
              <div>
                <CardTitle className="text-lg">{user?.role === 'admin' ? 'مدير' : 'مستخدم'}</CardTitle>
                <CardDescription>نوع الحساب</CardDescription>
              </div>
            </CardHeader>
          </Card>
        </div>

        {/* Projects */}
        <Card>
          <CardHeader>
            <CardTitle>{t('dashboard.recentProjects')}</CardTitle>
          </CardHeader>
          <CardContent>
            {projects.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                لا توجد مشاريع بعد. ابدأ بإنشاء مشروعك الأول!
              </p>
            ) : (
              <div className="space-y-2">
                {projects.map(project => (
                  <div key={project.id} className="p-4 border rounded-lg flex justify-between items-center">
                    <div>
                      <p className="font-medium">{project.name}</p>
                      <p className="text-sm text-muted-foreground">{project.template}</p>
                    </div>
                    <span className={`badge-${project.status === 'completed' ? 'success' : 'warning'}`}>
                      {t(`projects.${project.status}`)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
