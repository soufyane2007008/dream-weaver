/**
 * صفحة إنشاء مشروع جديد
 * تتيح للمستخدم اختيار القالب وإدخال التفاصيل
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { getCurrentUser } from '@/firebase/firebase.auth';
import { createProjectRequest, type ProjectProgress } from '@/builder/generator';
import { allTemplates, type TemplateId } from '@/builder/templates';
import { toast } from '@/hooks/use-toast';
import { ArrowLeft, Check, Loader2, Palette, FileText, Globe, Download } from 'lucide-react';
import { t } from '@/i18n';

export default function CreateProject() {
  const user = getCurrentUser();
  const navigate = useNavigate();
  
  const [step, setStep] = useState<'template' | 'details' | 'creating' | 'done'>('template');
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateId | null>(null);
  const [projectName, setProjectName] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [primaryColor, setPrimaryColor] = useState('#1E88E5');
  const [secondaryColor, setSecondaryColor] = useState('#FFB74D');
  
  const [progress, setProgress] = useState<ProjectProgress | null>(null);
  const [createdProjectId, setCreatedProjectId] = useState<string | null>(null);

  const handleSelectTemplate = (templateId: TemplateId) => {
    setSelectedTemplate(templateId);
    setStep('details');
  };

  const handleCreateProject = async () => {
    if (!user || !selectedTemplate || !projectName.trim()) {
      toast({
        title: 'خطأ',
        description: 'يرجى إدخال اسم المشروع',
        variant: 'destructive',
      });
      return;
    }

    setStep('creating');

    const result = await createProjectRequest(
      user.uid,
      {
        name: projectName.trim(),
        description: projectDescription.trim(),
        templateId: selectedTemplate,
        colors: {
          primary: primaryColor,
          secondary: secondaryColor,
        },
      },
      (p) => setProgress(p)
    );

    if (result.success && result.projectId) {
      setCreatedProjectId(result.projectId);
      setStep('done');
      toast({
        title: 'تم بنجاح!',
        description: 'تم إنشاء مشروعك بنجاح',
      });
    } else {
      toast({
        title: 'فشل الإنشاء',
        description: result.error || 'حدث خطأ أثناء الإنشاء',
        variant: 'destructive',
      });
      setStep('details');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container-rtl flex h-16 items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/dashboard')}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-bold">إنشاء مشروع جديد</h1>
        </div>
      </header>

      <main className="container-rtl py-8 max-w-4xl">
        {/* خطوات التقدم */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className={`flex items-center gap-2 ${step === 'template' ? 'text-primary' : 'text-muted-foreground'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === 'template' ? 'bg-primary text-white' : 'bg-muted'}`}>
              1
            </div>
            <span className="hidden sm:inline">اختر القالب</span>
          </div>
          <div className="w-12 h-0.5 bg-muted" />
          <div className={`flex items-center gap-2 ${step === 'details' ? 'text-primary' : 'text-muted-foreground'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === 'details' ? 'bg-primary text-white' : 'bg-muted'}`}>
              2
            </div>
            <span className="hidden sm:inline">التفاصيل</span>
          </div>
          <div className="w-12 h-0.5 bg-muted" />
          <div className={`flex items-center gap-2 ${step === 'creating' || step === 'done' ? 'text-primary' : 'text-muted-foreground'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === 'done' ? 'bg-green-500 text-white' : step === 'creating' ? 'bg-primary text-white' : 'bg-muted'}`}>
              {step === 'done' ? <Check className="h-4 w-4" /> : '3'}
            </div>
            <span className="hidden sm:inline">الإنشاء</span>
          </div>
        </div>

        {/* اختيار القالب */}
        {step === 'template' && (
          <div>
            <h2 className="text-2xl font-bold mb-6 text-center">اختر قالب موقعك</h2>
            <div className="grid gap-4 md:grid-cols-2">
              {allTemplates.map((template) => (
                <Card 
                  key={template.id}
                  className={`cursor-pointer transition-all hover:border-primary hover:shadow-lg ${
                    selectedTemplate === template.id ? 'border-primary ring-2 ring-primary' : ''
                  }`}
                  onClick={() => handleSelectTemplate(template.id)}
                >
                  <CardHeader>
                    <div className="aspect-video bg-gradient-to-br from-primary/20 to-secondary/20 rounded-lg mb-4 flex items-center justify-center">
                      <Globe className="h-12 w-12 text-primary/50" />
                    </div>
                    <CardTitle>{template.name}</CardTitle>
                    <CardDescription>{template.description}</CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* تفاصيل المشروع */}
        {step === 'details' && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                تفاصيل المشروع
              </CardTitle>
              <CardDescription>
                أدخل معلومات موقعك
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">اسم المشروع *</Label>
                <Input
                  id="name"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  placeholder="مثال: موقع شركتي"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">وصف المشروع</Label>
                <Textarea
                  id="description"
                  value={projectDescription}
                  onChange={(e) => setProjectDescription(e.target.value)}
                  placeholder="صف موقعك بإيجاز..."
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Palette className="h-4 w-4" />
                  الألوان
                </Label>
                <div className="flex gap-4">
                  <div className="flex items-center gap-2">
                    <Label htmlFor="primary" className="text-sm text-muted-foreground">الرئيسي</Label>
                    <input
                      type="color"
                      id="primary"
                      value={primaryColor}
                      onChange={(e) => setPrimaryColor(e.target.value)}
                      className="w-10 h-10 rounded cursor-pointer"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Label htmlFor="secondary" className="text-sm text-muted-foreground">الثانوي</Label>
                    <input
                      type="color"
                      id="secondary"
                      value={secondaryColor}
                      onChange={(e) => setSecondaryColor(e.target.value)}
                      className="w-10 h-10 rounded cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <Button variant="outline" onClick={() => setStep('template')}>
                  رجوع
                </Button>
                <Button onClick={handleCreateProject} disabled={!projectName.trim()}>
                  إنشاء المشروع
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* عملية الإنشاء */}
        {step === 'creating' && progress && (
          <Card>
            <CardContent className="py-12">
              <div className="text-center space-y-6">
                <Loader2 className="h-16 w-16 animate-spin mx-auto text-primary" />
                <div>
                  <h3 className="text-xl font-bold mb-2">جارٍ إنشاء موقعك...</h3>
                  <p className="text-muted-foreground">{progress.message}</p>
                </div>
                <div className="max-w-md mx-auto">
                  <Progress value={progress.progress} className="h-3" />
                  <p className="text-sm text-muted-foreground mt-2">{progress.progress}%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* تم الإنشاء */}
        {step === 'done' && (
          <Card>
            <CardContent className="py-12">
              <div className="text-center space-y-6">
                <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mx-auto">
                  <Check className="h-10 w-10 text-green-500" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-2">تم إنشاء موقعك بنجاح!</h3>
                  <p className="text-muted-foreground">يمكنك الآن معاينة وتحميل موقعك</p>
                </div>
                <div className="flex gap-4 justify-center">
                  <Button variant="outline" onClick={() => navigate('/dashboard')}>
                    العودة للوحة التحكم
                  </Button>
                  <Button onClick={() => navigate(`/preview/${createdProjectId}`)}>
                    معاينة الموقع
                  </Button>
                  <Button variant="secondary">
                    <Download className="h-4 w-4 ml-2" />
                    تحميل ZIP
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
