import { prisma } from '@/lib/db';
import { formatDate } from '@/lib/utils';
import { Brain, RefreshCw, CheckCircle, AlertTriangle, Info, Lightbulb } from 'lucide-react';
import { GenerateInsightsButton } from '@/components/GenerateInsightsButton';
import { DismissInsightButton } from '@/components/DismissInsightButton';

async function getInsightsAndEntries() {
  const [insights, recentEntries] = await Promise.all([
    prisma.aiInsight.findMany({
      orderBy: { createdAt: 'desc' },
    }),
    prisma.journalEntry.count({
      where: {
        createdAt: {
          gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        },
      },
    }),
  ]);

  return { insights, recentEntries };
}

function getInsightIcon(type: string, severity: string) {
  if (type === 'alert' && severity === 'concern') {
    return <AlertTriangle className="w-5 h-5 text-primary-600" />;
  }
  if (type === 'alert' && severity === 'warning') {
    return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
  }
  if (type === 'suggestion') {
    return <Lightbulb className="w-5 h-5 text-calm-600" />;
  }
  return <Info className="w-5 h-5 text-secondary-600" />;
}

export default async function InsightsPage() {
  const { insights, recentEntries } = await getInsightsAndEntries();

  const activeInsights = insights.filter((i) => !i.dismissed);
  const dismissedInsights = insights.filter((i) => i.dismissed);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-secondary-800">AI Insights</h1>
          <p className="text-secondary-500 mt-1">
            Patterns and suggestions from your journal
          </p>
        </div>
        <GenerateInsightsButton hasEntries={recentEntries > 0} />
      </div>

      {/* Info Card */}
      <div className="card bg-gradient-to-br from-calm-50 to-primary-50 border-0">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center">
            <Brain className="w-6 h-6 text-calm-600" />
          </div>
          <div>
            <h3 className="font-semibold text-secondary-800">How AI Insights Work</h3>
            <p className="text-secondary-600 mt-1 text-sm">
              The AI reviews your journal entries to identify patterns in your mood, energy,
              and anxiety levels. It looks for trends over time and provides gentle suggestions.
              This is not medical advice - always consult healthcare providers for concerns.
            </p>
          </div>
        </div>
      </div>

      {activeInsights.length === 0 && dismissedInsights.length === 0 ? (
        <div className="card text-center py-16">
          <Brain className="w-16 h-16 text-primary-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-secondary-700">No Insights Yet</h2>
          <p className="text-secondary-500 mt-2 mb-6 max-w-md mx-auto">
            {recentEntries > 0
              ? 'Click "Generate Insights" to analyze your recent journal entries.'
              : 'Start writing journal entries, and the AI will analyze patterns to provide helpful insights.'}
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Active Insights */}
          {activeInsights.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold text-secondary-600 mb-4">
                Current Insights ({activeInsights.length})
              </h2>
              <div className="space-y-4">
                {activeInsights.map((insight) => {
                  const suggestions = insight.suggestions
                    ? JSON.parse(insight.suggestions)
                    : [];

                  return (
                    <div
                      key={insight.id}
                      className={`insight-card insight-${insight.severity}`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                          {getInsightIcon(insight.type, insight.severity)}
                          <div>
                            <h3 className="font-semibold text-secondary-800">
                              {insight.title}
                            </h3>
                            <p className="text-secondary-600 mt-1">{insight.content}</p>

                            {suggestions.length > 0 && (
                              <div className="mt-4">
                                <p className="text-sm font-medium text-secondary-700 mb-2">
                                  Suggestions:
                                </p>
                                <ul className="space-y-1">
                                  {suggestions.map((suggestion: string, index: number) => (
                                    <li
                                      key={index}
                                      className="text-sm text-secondary-600 flex items-start gap-2"
                                    >
                                      <CheckCircle className="w-4 h-4 text-calm-500 mt-0.5 flex-shrink-0" />
                                      {suggestion}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}

                            <p className="text-xs text-secondary-400 mt-4">
                              {formatDate(insight.periodStart)} - {formatDate(insight.periodEnd)}
                            </p>
                          </div>
                        </div>
                        <DismissInsightButton id={insight.id} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Dismissed Insights */}
          {dismissedInsights.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold text-secondary-400 mb-4">
                Past Insights ({dismissedInsights.length})
              </h2>
              <div className="space-y-3 opacity-60">
                {dismissedInsights.slice(0, 5).map((insight) => (
                  <div key={insight.id} className="card bg-secondary-50">
                    <div className="flex items-center gap-3">
                      {getInsightIcon(insight.type, insight.severity)}
                      <div>
                        <h3 className="font-medium text-secondary-600">{insight.title}</h3>
                        <p className="text-sm text-secondary-400">
                          {formatDate(insight.createdAt)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
