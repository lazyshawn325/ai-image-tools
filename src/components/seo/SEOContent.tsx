import { Container } from "@/components/layout/Container";
import { Check, HelpCircle, BookOpen } from "lucide-react";

interface FAQItem {
  question: string;
  answer: string;
}

interface SEOContentProps {
  title: string;
  description: string;
  features: string[];
  howToUse: string[];
  faq: FAQItem[];
}

export function SEOContent({
  title,
  description,
  features,
  howToUse,
  faq,
}: SEOContentProps) {
  return (
    <section className="py-16 bg-gray-50/50 dark:bg-gray-900/30 border-t border-gray-100 dark:border-gray-800">
      <Container size="md">
        <div className="space-y-12">
          <div className="prose prose-lg dark:prose-invert max-w-none">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white mb-6">
              {title}
            </h2>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              {description}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg text-blue-600 dark:text-blue-400">
                  <Check className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  功能特点
                </h3>
              </div>
              <ul className="space-y-4">
                {features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-blue-500 flex-shrink-0" />
                    <span className="text-gray-600 dark:text-gray-300">
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg text-green-600 dark:text-green-400">
                  <BookOpen className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  如何使用
                </h3>
              </div>
              <ol className="space-y-4 relative border-l-2 border-gray-100 dark:border-gray-800 ml-3 pl-8">
                {howToUse.map((step, index) => (
                  <li key={index} className="relative">
                    <span className="absolute -left-[41px] top-0 flex items-center justify-center w-6 h-6 rounded-full bg-gray-100 dark:bg-gray-800 text-sm font-medium text-gray-500 dark:text-gray-400 border-2 border-white dark:border-gray-950">
                      {index + 1}
                    </span>
                    <span className="text-gray-600 dark:text-gray-300">
                      {step}
                    </span>
                  </li>
                ))}
              </ol>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg text-purple-600 dark:text-purple-400">
                <HelpCircle className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                常见问题
              </h3>
            </div>
            <div className="grid grid-cols-1 gap-6">
              {faq.map((item, index) => (
                <div
                  key={index}
                  className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow"
                >
                  <h4 className="font-semibold text-lg text-gray-900 dark:text-white mb-3">
                    {item.question}
                  </h4>
                  <p className="text-gray-600 dark:text-gray-400">
                    {item.answer}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
