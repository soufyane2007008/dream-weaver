/**
 * صفحة معاينة المشروع
 * تعرض الموقع المُنشأ في iframe آمن
 */

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { getDocument } from '@/firebase/firebase.db';
import { downloadProjectZip, listenToProject } from '@/builder/generator';
import { downloadBlob, createZipFromFiles, type ExportProgress } from '@/builder/exporter';
import { toast } from '@/hooks/use-toast';
import { ArrowLeft, Download, ExternalLink, Loader2, RefreshCw, Code } from 'lucide-react';
import type { Project } from '@/types/global.d';

export default function PreviewPage() {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState<ExportProgress | null>(null);
  const [previewHtml, setPreviewHtml] = useState<string>('');
  const [showCode, setShowCode] = useState(false);

  useEffect(() => {
    if (!projectId) return;

    // استماع للتحديثات الحية
    const unsubscribe = listenToProject(projectId, (p) => {
      if (p) {
        setProject(p);
        if (p.filesContent && p.filesContent['index.html']) {
          setPreviewHtml(p.filesContent['index.html']);
        }
      }
      setLoading(false);
    });

    return unsubscribe;
  }, [projectId]);

  const handleDownload = async () => {
    if (!project || !project.filesContent) {
      toast({
        title: 'خطأ',
        description: 'لا توجد ملفات للتحميل',
        variant: 'destructive',
      });
      return;
    }

    setDownloading(true);
    try {
      const blob = await createZipFromFiles(project.filesContent, setDownloadProgress);
      const fileName = `${project.name.replace(/\s+/g, '-')}-${project.id.slice(0, 8)}.zip`;
      downloadBlob(blob, fileName);
      
      toast({
        title: 'تم التحميل',
        description: 'تم تحميل ملف ZIP بنجاح',
      });
    } catch (error) {
      toast({
        title: 'خطأ',
        description: 'فشل تحميل الملفات',
        variant: 'destructive',
      });
    }
    setDownloading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin mx-auto text-primary mb-4" />
          <p className="text-muted-foreground">جارٍ تحميل المشروع...</p>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="py-12 text-center">
            <h2 className="text-xl font-bold mb-4">المشروع غير موجود</h2>
            <p className="text-muted-foreground mb-6">لا يمكن العثور على هذا المشروع</p>
            <Button onClick={() => navigate('/dashboard')}>
              العودة للوحة التحكم
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card sticky top-0 z-50">
        <div className="container-rtl flex h-14 items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate('/dashboard')}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="font-bold">{project.name}</h1>
              <p className="text-xs text-muted-foreground">{project.template}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => setShowCode(!showCode)}>
              <Code className="h-4 w-4 ml-2" />
              {showCode ? 'معاينة' : 'الكود'}
            </Button>
            
            <Button 
              variant="default" 
              size="sm" 
              onClick={handleDownload}
              disabled={downloading || !project.filesContent}
            >
              {downloading ? (
                <Loader2 className="h-4 w-4 animate-spin ml-2" />
              ) : (
                <Download className="h-4 w-4 ml-2" />
              )}
              تحميل ZIP
            </Button>
          </div>
        </div>
        
        {/* شريط التقدم */}
        {downloading && downloadProgress && (
          <div className="px-4 pb-2">
            <Progress value={downloadProgress.progress} className="h-1" />
          </div>
        )}
      </header>

      {/* المحتوى */}
      <main className="h-[calc(100vh-56px)]">
        {project.status === 'completed' && project.filesContent ? (
          showCode ? (
            <div className="p-4 h-full overflow-auto">
              <div className="space-y-4">
                {Object.entries(project.filesContent).map(([filename, content]) => (
                  <Card key={filename}>
                    <CardContent className="pt-4">
                      <h3 className="font-mono text-sm font-bold mb-2 text-primary">{filename}</h3>
                      <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-xs">
                        <code>{content}</code>
                      </pre>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ) : (
            <iframe
              srcDoc={previewHtml}
              className="w-full h-full border-0"
              sandbox="allow-scripts allow-same-origin"
              title="معاينة الموقع"
            />
          )
        ) : (
          <div className="flex items-center justify-center h-full">
            <Card className="max-w-md">
              <CardContent className="py-12 text-center">
                {project.status === 'pending' || project.status === 'generating' || project.status === 'processing' ? (
                  <>
                    <Loader2 className="h-12 w-12 animate-spin mx-auto text-primary mb-4" />
                    <h2 className="text-xl font-bold mb-2">جارٍ الإنشاء...</h2>
                    <p className="text-muted-foreground">يتم توليد موقعك الآن</p>
                  </>
                ) : project.status === 'failed' ? (
                  <>
                    <div className="w-16 h-16 rounded-full bg-destructive/20 flex items-center justify-center mx-auto mb-4">
                      <RefreshCw className="h-8 w-8 text-destructive" />
                    </div>
                    <h2 className="text-xl font-bold mb-2">فشل الإنشاء</h2>
                    <p className="text-muted-foreground mb-4">{project.error || 'حدث خطأ أثناء الإنشاء'}</p>
                    <Button onClick={() => navigate('/dashboard')}>
                      العودة للوحة التحكم
                    </Button>
                  </>
                ) : (
                  <>
                    <h2 className="text-xl font-bold mb-2">لا توجد معاينة</h2>
                    <p className="text-muted-foreground">لم يتم توليد الملفات بعد</p>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
}
