class DocumentProcessor {
    constructor() {
        this.rules = null;
        this.initializeRules();
    }

    async initializeRules() {
        try {
            const response = await fetch('./config/legalRules.json');
            if (!response.ok) {
                throw new Error('Failed to load rules');
            }
            this.rules = await response.json();
            console.log('Legal rules loaded successfully');
        } catch (error) {
            console.error('Error loading legal rules:', error);
            // Fallback rules jika gagal load
            this.rules = this.getFallbackRules();
        }
    }

    getFallbackRules() {
        return {
            clause_patterns: {
                confidentiality: {
                    keywords: ["rahasia", "kerahasiaan", "confidential"],
                    risk_level: "medium",
                    description: "Klausul Kerahasiaan"
                },
                liability: {
                    keywords: ["tanggung jawab", "ganti rugi", "jaminan"],
                    risk_level: "high", 
                    description: "Klausul Tanggung Jawab"
                },
                payment: {
                    keywords: ["pembayaran", "biaya", "harga"],
                    risk_level: "low",
                    description: "Klausul Pembayaran"
                }
            },
            risk_indicators: {
                high_risk_terms: ["tanpa batas", "selamanya", "mutlak"],
                warning_signs: ["denda", "sanksi", "sepihak"]
            },
            analysis_rules: {
                min_contract_length: 100,
                max_risk_score: 100
            }
        };
    }

    async processDocument(file) {
        // Tunggu rules selesai load
        if (!this.rules) {
            await this.initializeRules();
        }
        
        const text = await this.extractText(file);
        return this.analyzeDocument(text);
    }

    async extractText(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            
            reader.onload = function(e) {
                resolve(e.target.result);
            };
            
            reader.onerror = function(e) {
                reject(new Error('Gagal membaca file: ' + e.target.error));
            };

            reader.readAsText(file);
        });
    }

    analyzeDocument(text) {
        if (!this.rules) {
            throw new Error('Rules belum berhasil dimuat');
        }

        const analysis = {
            clauses: [],
            issues: [],
            risks: [],
            summary: {},
            riskScore: 0
        };

        this.analyzeClauses(text, analysis);
        this.analyzeRisks(text, analysis);
        this.calculateRiskScore(analysis);
        this.generateSummary(analysis);

        return analysis;
    }

    analyzeClauses(text, analysis) {
        const lowerText = text.toLowerCase();
        
        for (const [clauseType, pattern] of Object.entries(this.rules.clause_patterns)) {
            const foundKeywords = pattern.keywords.filter(keyword => 
                lowerText.includes(keyword.toLowerCase())
            );

            if (foundKeywords.length > 0) {
                analysis.clauses.push({
                    type: clauseType,
                    name: pattern.description,
                    keywords: foundKeywords,
                    riskLevel: pattern.risk_level,
                    context: this.extractContext(text, foundKeywords[0]),
                    confidence: this.calculateConfidence(foundKeywords.length, pattern.keywords.length)
                });
            }
        }
    }

    analyzeRisks(text, analysis) {
        const lowerText = text.toLowerCase();
        
        // Check high risk terms
        this.rules.risk_indicators.high_risk_terms.forEach(term => {
            if (lowerText.includes(term.toLowerCase())) {
                analysis.risks.push({
                    type: 'high_risk_term',
                    term: term,
                    riskLevel: 'high',
                    description: `Istilah berisiko tinggi: "${term}"`
                });
            }
        });

        // Check warning signs  
        this.rules.risk_indicators.warning_signs.forEach(term => {
            if (lowerText.includes(term.toLowerCase())) {
                analysis.issues.push({
                    type: 'warning_sign',
                    term: term,
                    riskLevel: 'medium',
                    description: `Peringatan: "${term}"`
                });
            }
        });

        // Document length check
        if (text.length < this.rules.analysis_rules.min_contract_length) {
            analysis.issues.push({
                type: 'document_length',
                riskLevel: 'medium',
                description: 'Dokumen terlalu pendek, mungkin tidak lengkap'
            });
        }
    }

    extractContext(text, keyword, contextLength = 100) {
        const index = text.toLowerCase().indexOf(keyword.toLowerCase());
        if (index === -1) return '';
        
        const start = Math.max(0, index - contextLength);
        const end = Math.min(text.length, index + keyword.length + contextLength);
        
        let context = text.substring(start, end);
        if (start > 0) context = '...' + context;
        if (end < text.length) context = context + '...';
        
        return context;
    }

    calculateConfidence(foundCount, totalCount) {
        return Math.min(100, Math.round((foundCount / totalCount) * 100));
    }

    calculateRiskScore(analysis) {
        let score = 0;
        const weights = { low: 1, medium: 3, high: 5 };

        analysis.clauses.forEach(clause => {
            score += weights[clause.riskLevel] || 1;
        });

        analysis.risks.forEach(risk => {
            score += weights[risk.riskLevel] || 3;
        });

        analysis.issues.forEach(issue => {
            score += weights[issue.riskLevel] || 2;
        });

        analysis.riskScore = Math.min(100, score * 5);
    }

    generateSummary(analysis) {
        analysis.summary = {
            totalClauses: analysis.clauses.length,
            totalRisks: analysis.risks.length,
            totalIssues: analysis.issues.length,
            riskLevel: this.getRiskLevel(analysis.riskScore),
            documentComplexity: this.getComplexity(analysis.clauses.length)
        };
    }

    getRiskLevel(score) {
        if (score < 25) return 'low';
        if (score < 50) return 'medium';
        if (score < 75) return 'high';
        return 'critical';
    }

    getComplexity(clauseCount) {
        if (clauseCount < 3) return 'Sederhana';
        if (clauseCount < 6) return 'Menengah';
        return 'Kompleks';
    }
}