
"use client";

import { AppLayout } from '@/components/layout/app-layout';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookText, HelpCircle, FileText } from 'lucide-react';
import Image from 'next/image';

interface Article {
  id: string;
  title: string;
  summary: string;
  content: React.ReactNode;
  imageUrl?: string;
  imageHint?: string;
}

const articles: Article[] = [
  {
    id: 'chemo-side-effects',
    title: "Understanding Chemotherapy Side Effects",
    summary: "Learn about common side effects of chemotherapy and how they might be managed.",
    imageUrl: "https://placehold.co/600x300.png",
    imageHint: "medical consultation",
    content: (
      <div className="space-y-4">
        <p>Chemotherapy is a powerful treatment against cancer, but it can also affect healthy cells, leading to side effects. The specific side effects vary depending on the type and dose of chemotherapy drugs used and individual patient factors.</p>
        <h3 className="font-semibold font-headline text-lg">Common Side Effects:</h3>
        <ul className="list-disc list-inside space-y-1 pl-4">
          <li><strong>Fatigue:</strong> Feeling extremely tired and lacking energy is very common.</li>
          <li><strong>Nausea and Vomiting:</strong> Medications can often help manage these symptoms.</li>
          <li><strong>Hair Loss:</strong> Not all chemotherapy drugs cause hair loss, but many do.</li>
          <li><strong>Mouth Sores (Mucositis):</strong> Painful sores in the mouth and throat.</li>
          <li><strong>Increased Risk of Infection:</strong> Due to a lower white blood cell count.</li>
          <li><strong>Easy Bruising or Bleeding:</strong> Due to a lower platelet count.</li>
          <li><strong>Changes in Appetite and Taste:</strong> Food may taste different, or you may not feel hungry.</li>
        </ul>
        <p>It's crucial to report any side effects to your healthcare team. They can provide treatments, suggest coping strategies, and adjust your cancer treatment plan if necessary. Open communication helps ensure you receive the best possible care and quality of life during treatment.</p>
      </div>
    ),
  },
  {
    id: 'managing-fatigue',
    title: "Managing Fatigue During Cancer Treatment",
    summary: "Discover strategies to cope with cancer-related fatigue.",
    imageUrl: "https://placehold.co/600x300.png",
    imageHint: "person resting",
    content: (
      <div className="space-y-4">
        <p>Cancer-related fatigue is different from normal tiredness. It's often more severe, lasts longer, and isn't always relieved by rest. It can significantly impact daily life.</p>
        <h3 className="font-semibold font-headline text-lg">Strategies to Manage Fatigue:</h3>
        <ul className="list-disc list-inside space-y-1 pl-4">
          <li><strong>Conserve Energy:</strong> Prioritize activities and delegate tasks when possible. Plan rest periods throughout the day.</li>
          <li><strong>Gentle Exercise:</strong> Activities like walking or yoga, as approved by your doctor, can actually help reduce fatigue.</li>
          <li><strong>Good Nutrition:</strong> Eat a balanced diet and stay hydrated. Small, frequent meals might be easier to manage.</li>
          <li><strong>Manage Stress:</strong> Techniques like meditation, deep breathing, or spending time in nature can help.</li>
          <li><strong>Improve Sleep:</strong> Maintain a regular sleep schedule and create a restful sleep environment.</li>
          <li><strong>Talk to Your Doctor:</strong> Rule out other causes of fatigue (like anemia or thyroid problems) and discuss potential treatments.</li>
        </ul>
        <p>Remember, you are not alone in experiencing fatigue. It's a very real and challenging side effect. Be kind to yourself and seek support from your care team, family, and friends.</p>
      </div>
    ),
  },
  {
    id: 'fear-of-recurrence',
    title: "Coping with Fear of Recurrence",
    summary: "Addressing the common anxiety about cancer returning after treatment.",
    imageUrl: "https://placehold.co/600x300.png",
    imageHint: "hope sunrise",
    content: (
      <div className="space-y-4">
        <p>Fear of cancer recurrence (FOR) is a common and understandable concern for many cancer survivors. Even after successful treatment, the thought that cancer might come back can be a source of anxiety.</p>
        <h3 className="font-semibold font-headline text-lg">Ways to Cope with FOR:</h3>
        <ul className="list-disc list-inside space-y-1 pl-4">
          <li><strong>Acknowledge Your Feelings:</strong> It's okay to feel anxious. Don't try to ignore or suppress these emotions.</li>
          <li><strong>Talk About It:</strong> Share your fears with trusted family, friends, other survivors, or a mental health professional.</li>
          <li><strong>Stay Informed:</strong> Understand your specific type of cancer, treatment, and follow-up plan. Ask your doctor about signs of recurrence to watch for.</li>
          <li><strong>Focus on Wellness:</strong> Engage in healthy lifestyle choices such as a balanced diet, regular exercise, and stress management. This can give you a sense of control.</li>
          <li><strong>Attend Follow-Up Appointments:</strong> Regular check-ups are important for monitoring your health.</li>
          <li><strong>Live in the Present:</strong> Practice mindfulness or other techniques to help you focus on today rather than worrying excessively about the future.</li>
          <li><strong>Seek Professional Support:</strong> If FOR significantly impacts your daily life, consider counseling or support groups.</li>
        </ul>
        <p>Managing fear of recurrence is an ongoing process. Finding healthy coping strategies and support systems can make a significant difference in your quality of life after cancer.</p>
      </div>
    ),
  },
];

interface GlossaryTerm {
  id: string;
  term: string;
  definition: string;
}

const glossaryTerms: GlossaryTerm[] = [
  { id: 'biopsy', term: "Biopsy", definition: "The removal of a small piece of tissue for examination under a microscope to diagnose a disease." },
  { id: 'metastasis', term: "Metastasis", definition: "The spread of cancer cells from the place where they first formed to another part of the body." },
  { id: 'remission', term: "Remission", definition: "A decrease in or disappearance of signs and symptoms of cancer. In complete remission, all signs and symptoms of cancer have disappeared." },
  { id: 'prognosis', term: "Prognosis", definition: "The likely course or outcome of a disease. It's an educated guess about how the cancer will progress and respond to treatment." },
  { id: 'palliative_care', term: "Palliative Care", definition: "Specialized medical care focused on providing relief from the symptoms and stress of a serious illness. The goal is to improve quality of life for both the patient and the family." },
];

export default function EducationPage() {
  const [selectedArticle, setSelectedArticle] = React.useState<Article | null>(null);

  if (selectedArticle) {
    return (
       <AppLayout>
        <div className="space-y-6">
           <Button onClick={() => setSelectedArticle(null)} variant="outline" className="mb-4">
            &larr; Back to Education Hub
          </Button>
          <Card>
            <CardHeader>
              <CardTitle className="font-headline text-2xl md:text-3xl">{selectedArticle.title}</CardTitle>
            </CardHeader>
            <CardContent>
              {selectedArticle.imageUrl && (
                <div className="relative h-48 md:h-72 w-full rounded-lg overflow-hidden mb-6">
                  <Image 
                    src={selectedArticle.imageUrl} 
                    alt={selectedArticle.title} 
                    layout="fill" 
                    objectFit="cover"
                    data-ai-hint={selectedArticle.imageHint || "medical information"}
                  />
                </div>
              )}
              <div className="prose prose-sm sm:prose lg:prose-lg xl:prose-xl max-w-none text-foreground">
                {selectedArticle.content}
              </div>
            </CardContent>
          </Card>
        </div>
      </AppLayout>
    )
  }


  return (
    <AppLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-headline tracking-tight">Educational Hub</h1>
        
        <Tabs defaultValue="articles">
          <TabsList className="grid w-full grid-cols-2 md:w-auto md:inline-flex">
            <TabsTrigger value="articles" className="gap-2"><FileText className="h-4 w-4" /> Articles & FAQs</TabsTrigger>
            <TabsTrigger value="glossary" className="gap-2"><HelpCircle className="h-4 w-4" /> Medical Glossary</TabsTrigger>
          </TabsList>

          <TabsContent value="articles">
            <Card>
              <CardHeader>
                <CardTitle className="font-headline">Articles & FAQs</CardTitle>
                <CardDescription>Find information on common cancer-related topics.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {articles.map(article => (
                  <Card key={article.id} className="hover:shadow-md transition-shadow">
                    <CardHeader>
                       {article.imageUrl && (
                        <div className="relative h-40 w-full rounded-t-lg overflow-hidden mb-4">
                          <Image 
                            src={article.imageUrl} 
                            alt={article.title} 
                            layout="fill" 
                            objectFit="cover" 
                            data-ai-hint={article.imageHint || "medical information"}
                          />
                        </div>
                      )}
                      <CardTitle className="font-headline text-xl">{article.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-4">{article.summary}</p>
                      <Button onClick={() => setSelectedArticle(article)} variant="link" className="p-0 h-auto">Read More &rarr;</Button>
                    </CardContent>
                  </Card>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="glossary">
            <Card>
              <CardHeader>
                <CardTitle className="font-headline">Medical Glossary</CardTitle>
                <CardDescription>Understand common medical terms related to cancer.</CardDescription>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  {glossaryTerms.map(item => (
                    <AccordionItem value={item.id} key={item.id}>
                      <AccordionTrigger className="font-semibold">{item.term}</AccordionTrigger>
                      <AccordionContent>
                        <p className="text-sm">{item.definition}</p>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}
