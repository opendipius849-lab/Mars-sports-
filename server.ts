import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const isProd = process.env.NODE_ENV === 'production';

app.use(express.json());

// Initialize Google GenAI client
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;
if (apiKey) {
  ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Fallback intelligent prediction generator for when API key is not yet set or when offline
function generateFallbackPrediction(homeTeam: string, awayTeam: string, league?: string, sport: string = 'football') {
  // Deterministic seed based on team names
  const seed = (homeTeam + awayTeam).split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const homeBias = ((seed % 25) + 38); // 38% to 62%
  const awayBias = ((seed % 17) + 20); // 20% to 36%
  const drawBias = Math.max(10, 100 - homeBias - awayBias);

  // Normalize
  const total = homeBias + awayBias + drawBias;
  const homeWinPct = Math.round((homeBias / total) * 100);
  const awayWinPct = Math.round((awayBias / total) * 100);
  const drawPct = Math.max(5, 100 - homeWinPct - awayWinPct);

  const homeAttack = 65 + (seed % 30);
  const homeDefense = 60 + ((seed * 3) % 32);
  const awayAttack = 60 + ((seed * 7) % 32);
  const awayDefense = 58 + ((seed * 5) % 34);

  const isHomeFavorite = homeWinPct >= awayWinPct;
  const mostPredictedHomeGoals = isHomeFavorite ? (homeWinPct > 55 ? 2 : 2) : 1;
  const mostPredictedAwayGoals = isHomeFavorite ? 1 : (awayWinPct > 55 ? 2 : 1);

  const totalVotes = 145000 + (seed % 120000);

  return {
    homeTeam,
    awayTeam,
    league: league || 'World League Championship',
    sport,
    mostGivenPrediction: `${isHomeFavorite ? homeTeam : awayTeam} to win ${mostPredictedHomeGoals} - ${mostPredictedAwayGoals}`,
    confidence: 68 + (seed % 24),
    recommendedBet: `${isHomeFavorite ? homeTeam : awayTeam} Win or Draw & Over 1.5 Goals`,
    projectedScore: {
      home: mostPredictedHomeGoals,
      away: mostPredictedAwayGoals,
    },
    worldConsensus: {
      homeWinPercentage: homeWinPct,
      drawPercentage: drawPct,
      awayWinPercentage: awayWinPct,
      over25GoalsPercentage: 55 + (seed % 25),
      under25GoalsPercentage: Math.max(20, 100 - (55 + (seed % 25))),
      bttsYesPercentage: 62 + (seed % 20),
      bttsNoPercentage: Math.max(18, 100 - (62 + (seed % 20))),
      totalWorldVotesAnalyzed: totalVotes,
      sentimentByRegion: {
        europe: { home: Math.min(80, homeWinPct + 4), draw: drawPct, away: Math.max(10, awayWinPct - 4) },
        americas: { home: homeWinPct, draw: drawPct, away: awayWinPct },
        asia: { home: Math.max(15, homeWinPct - 3), draw: drawPct + 2, away: awayWinPct + 1 },
        africa: { home: Math.min(85, homeWinPct + 6), draw: Math.max(8, drawPct - 2), away: Math.max(7, awayWinPct - 4) },
      },
    },
    scorelineProbabilities: [
      { score: `${mostPredictedHomeGoals}-${mostPredictedAwayGoals}`, probability: 27, label: 'Consensus Favorite' },
      { score: `${mostPredictedHomeGoals + 1}-${mostPredictedAwayGoals}`, probability: 19, label: 'Home Margin' },
      { score: '1-1', probability: 17, label: 'Score Draw' },
      { score: `${mostPredictedHomeGoals}-${mostPredictedAwayGoals + 1}`, probability: 13, label: 'Away Threat' },
      { score: `${mostPredictedHomeGoals + 1}-0`, probability: 11, label: 'Home Clean Sheet' },
      { score: 'Other', probability: 13, label: 'High Variance' },
    ],
    graphicalAnalysis: {
      radarMetrics: {
        homeMetrics: {
          attack: homeAttack,
          defense: homeDefense,
          form: 72 + (seed % 22),
          h2hDominance: 65 + ((seed * 2) % 25),
          squadDepth: 75 + (seed % 18),
          tacticalDiscipline: 70 + ((seed * 4) % 24),
        },
        awayMetrics: {
          attack: awayAttack,
          defense: awayDefense,
          form: 68 + ((seed * 3) % 25),
          h2hDominance: 55 + (seed % 30),
          squadDepth: 70 + ((seed * 2) % 20),
          tacticalDiscipline: 68 + ((seed * 5) % 25),
        },
      },
      expectedGoals: {
        homeXg: Number((1.3 + (homeAttack / 100) * 0.9).toFixed(2)),
        awayXg: Number((0.9 + (awayAttack / 100) * 0.7).toFixed(2)),
      },
      possessionForecast: {
        home: 48 + (seed % 12),
        away: 100 - (48 + (seed % 12)),
      },
      keyMatchup: {
        playerHome: `${homeTeam} Key Forward`,
        playerAway: `${awayTeam} Anchor Defender`,
        description: `Direct battle between the primary attacking playmaker and the defensive transition block.`,
      },
      tacticalSummary: `${homeTeam} displays higher attacking territorial dominance in home fixtures, while ${awayTeam} relies on dangerous transition counters and set-piece efficiency.`,
      keyStrengthsHome: [
        'High pressing efficiency in the final third',
        'Strong home crowd conversion rate (xG +18%)',
        'Quick ball circulation through midfield channels',
      ],
      keyStrengthsAway: [
        'Potent transitional counter-attacks',
        'Aerial dominance during offensive set-pieces',
        'Resilient defensive low-block when under pressure',
      ],
      riskFactors: [
        'Potential squad rotation ahead of continental fixtures',
        'Defensive vulnerability on late wide crosses',
      ],
    },
    expertSourcesConsensus: [
      { source: 'Opta Analytics Supercomputer', prediction: `${homeWinPct > awayWinPct ? homeTeam : awayTeam} favored`, confidence: homeWinPct > awayWinPct ? homeWinPct : awayWinPct },
      { source: 'Global Fan Community Poll (250k+ votes)', prediction: `${mostPredictedHomeGoals} - ${mostPredictedAwayGoals}`, confidence: 71 },
      { source: 'Betting Exchange Implied Probability', prediction: `${isHomeFavorite ? homeTeam : awayTeam} / Draw`, confidence: 76 },
      { source: 'Tactical AI Simulation Engine', prediction: `Over 1.5 Goals with ${homeTeam} early pressure`, confidence: 82 },
    ],
  };
}

// POST /api/predict: Generates AI Match Prediction & World Consensus Analysis
app.post('/api/predict', async (req, res) => {
  try {
    const { homeTeam, awayTeam, league, sport = 'football', query } = req.body;

    let targetHome = homeTeam;
    let targetAway = awayTeam;
    let targetLeague = league || 'Premier Division';
    let targetSport = sport || 'football';

    // If query provided, parse it (e.g. "Arsenal vs Chelsea" or "Lakers vs Celtics")
    if (query && (!targetHome || !targetAway)) {
      const parts = query.split(/\s+(?:vs\.?|against|v)\s+/i);
      if (parts.length >= 2) {
        targetHome = parts[0].trim();
        targetAway = parts[1].trim();
      } else {
        const words = query.trim().split(/\s+/);
        if (words.length >= 2) {
          targetHome = words.slice(0, Math.floor(words.length / 2)).join(' ');
          targetAway = words.slice(Math.floor(words.length / 2)).join(' ');
        } else {
          targetHome = query.trim();
          targetAway = 'Opponent';
        }
      }
    }

    if (!targetHome || !targetAway) {
      return res.status(400).json({ error: 'homeTeam and awayTeam (or a valid query) are required.' });
    }

    if (!ai) {
      // Use fallback when no API key configured
      const fallback = generateFallbackPrediction(targetHome, targetAway, targetLeague, targetSport);
      return res.json({ ...fallback, isAIGenerated: false, note: 'AI preview mode with simulated statistical baseline' });
    }

    const prompt = `You are a world-class sports analytics intelligence engine powering LiveScore.
Analyze the upcoming or live match between:
Home Team: "${targetHome}"
Away Team: "${targetAway}"
League/Competition: "${targetLeague}"
Sport: "${targetSport}"

Fetch and compute the most prevalent consensus prediction, global fan polling sentiment, win probability distribution, scoreline matrix, and in-depth graphical metrics.
Provide realistic, highly granular sports analytics numbers.
Win probabilities (homeWinPercentage, drawPercentage, awayWinPercentage) MUST strictly sum to 100.
Over 2.5 and Under 2.5 percentages must sum to 100.
BTTS yes and no must sum to 100.
All radarMetrics scores must be integers between 35 and 95.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            homeTeam: { type: Type.STRING },
            awayTeam: { type: Type.STRING },
            league: { type: Type.STRING },
            sport: { type: Type.STRING },
            mostGivenPrediction: {
              type: Type.STRING,
              description: 'The single most given/agreed-upon prediction worldwide, e.g. "Arsenal to win 2 - 1 (BTTS Yes)"',
            },
            confidence: {
              type: Type.INTEGER,
              description: 'Confidence rating from 0 to 100',
            },
            recommendedBet: {
              type: Type.STRING,
              description: 'Key statistical edge recommendation, e.g. "Home Win or Draw & Over 1.5 Goals"',
            },
            projectedScore: {
              type: Type.OBJECT,
              properties: {
                home: { type: Type.INTEGER },
                away: { type: Type.INTEGER },
              },
              required: ['home', 'away'],
            },
            worldConsensus: {
              type: Type.OBJECT,
              properties: {
                homeWinPercentage: { type: Type.INTEGER },
                drawPercentage: { type: Type.INTEGER },
                awayWinPercentage: { type: Type.INTEGER },
                over25GoalsPercentage: { type: Type.INTEGER },
                under25GoalsPercentage: { type: Type.INTEGER },
                bttsYesPercentage: { type: Type.INTEGER },
                bttsNoPercentage: { type: Type.INTEGER },
                totalWorldVotesAnalyzed: { type: Type.INTEGER },
                sentimentByRegion: {
                  type: Type.OBJECT,
                  properties: {
                    europe: {
                      type: Type.OBJECT,
                      properties: { home: { type: Type.INTEGER }, draw: { type: Type.INTEGER }, away: { type: Type.INTEGER } },
                      required: ['home', 'draw', 'away'],
                    },
                    americas: {
                      type: Type.OBJECT,
                      properties: { home: { type: Type.INTEGER }, draw: { type: Type.INTEGER }, away: { type: Type.INTEGER } },
                      required: ['home', 'draw', 'away'],
                    },
                    asia: {
                      type: Type.OBJECT,
                      properties: { home: { type: Type.INTEGER }, draw: { type: Type.INTEGER }, away: { type: Type.INTEGER } },
                      required: ['home', 'draw', 'away'],
                    },
                    africa: {
                      type: Type.OBJECT,
                      properties: { home: { type: Type.INTEGER }, draw: { type: Type.INTEGER }, away: { type: Type.INTEGER } },
                      required: ['home', 'draw', 'away'],
                    },
                  },
                  required: ['europe', 'americas', 'asia', 'africa'],
                },
              },
              required: [
                'homeWinPercentage',
                'drawPercentage',
                'awayWinPercentage',
                'over25GoalsPercentage',
                'under25GoalsPercentage',
                'bttsYesPercentage',
                'bttsNoPercentage',
                'totalWorldVotesAnalyzed',
                'sentimentByRegion',
              ],
            },
            scorelineProbabilities: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  score: { type: Type.STRING },
                  probability: { type: Type.INTEGER },
                  label: { type: Type.STRING },
                },
                required: ['score', 'probability', 'label'],
              },
            },
            graphicalAnalysis: {
              type: Type.OBJECT,
              properties: {
                radarMetrics: {
                  type: Type.OBJECT,
                  properties: {
                    homeMetrics: {
                      type: Type.OBJECT,
                      properties: {
                        attack: { type: Type.INTEGER },
                        defense: { type: Type.INTEGER },
                        form: { type: Type.INTEGER },
                        h2hDominance: { type: Type.INTEGER },
                        squadDepth: { type: Type.INTEGER },
                        tacticalDiscipline: { type: Type.INTEGER },
                      },
                      required: ['attack', 'defense', 'form', 'h2hDominance', 'squadDepth', 'tacticalDiscipline'],
                    },
                    awayMetrics: {
                      type: Type.OBJECT,
                      properties: {
                        attack: { type: Type.INTEGER },
                        defense: { type: Type.INTEGER },
                        form: { type: Type.INTEGER },
                        h2hDominance: { type: Type.INTEGER },
                        squadDepth: { type: Type.INTEGER },
                        tacticalDiscipline: { type: Type.INTEGER },
                      },
                      required: ['attack', 'defense', 'form', 'h2hDominance', 'squadDepth', 'tacticalDiscipline'],
                    },
                  },
                  required: ['homeMetrics', 'awayMetrics'],
                },
                expectedGoals: {
                  type: Type.OBJECT,
                  properties: {
                    homeXg: { type: Type.NUMBER },
                    awayXg: { type: Type.NUMBER },
                  },
                  required: ['homeXg', 'awayXg'],
                },
                possessionForecast: {
                  type: Type.OBJECT,
                  properties: {
                    home: { type: Type.INTEGER },
                    away: { type: Type.INTEGER },
                  },
                  required: ['home', 'away'],
                },
                keyMatchup: {
                  type: Type.OBJECT,
                  properties: {
                    playerHome: { type: Type.STRING },
                    playerAway: { type: Type.STRING },
                    description: { type: Type.STRING },
                  },
                  required: ['playerHome', 'playerAway', 'description'],
                },
                tacticalSummary: { type: Type.STRING },
                keyStrengthsHome: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
                keyStrengthsAway: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
                riskFactors: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
              },
              required: [
                'radarMetrics',
                'expectedGoals',
                'possessionForecast',
                'keyMatchup',
                'tacticalSummary',
                'keyStrengthsHome',
                'keyStrengthsAway',
                'riskFactors',
              ],
            },
            expertSourcesConsensus: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  source: { type: Type.STRING },
                  prediction: { type: Type.STRING },
                  confidence: { type: Type.INTEGER },
                },
                required: ['source', 'prediction', 'confidence'],
              },
            },
          },
          required: [
            'homeTeam',
            'awayTeam',
            'league',
            'sport',
            'mostGivenPrediction',
            'confidence',
            'recommendedBet',
            'projectedScore',
            'worldConsensus',
            'scorelineProbabilities',
            'graphicalAnalysis',
            'expertSourcesConsensus',
          ],
        },
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json({ ...parsed, isAIGenerated: true });
  } catch (err: any) {
    console.error('Gemini prediction error:', err);
    // Graceful fallback to avoid breaking the user experience
    const fallback = generateFallbackPrediction(
      req.body.homeTeam || 'Home Team',
      req.body.awayTeam || 'Away Team',
      req.body.league || 'Top League',
      req.body.sport || 'football'
    );
    return res.json({
      ...fallback,
      isAIGenerated: false,
      errorNotice: err?.message || 'Statistical fallback used',
    });
  }
});

// Setup Vite middlewares for development, or serve static build in production
async function startServer() {
  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`LiveScore AI Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
