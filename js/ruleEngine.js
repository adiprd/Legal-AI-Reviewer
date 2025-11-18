class RuleEngine {
    constructor() {
        this.customRules = [];
    }

    addCustomRule(rule) {
        this.customRules.push(rule);
    }

    evaluateCustomRules(text, analysis) {
        this.customRules.forEach(rule => {
            if (rule.pattern && text.toLowerCase().includes(rule.pattern.toLowerCase())) {
                analysis.issues.push({
                    type: 'custom_rule',
                    description: rule.description,
                    riskLevel: rule.riskLevel || 'medium'
                });
            }
        });
    }

    getRiskColor(riskLevel) {
        const colors = {
            low: '#059669',
            medium: '#d97706', 
            high: '#dc2626',
            critical: '#7f1d1d'
        };
        return colors[riskLevel] || '#6b7280';
    }

    formatRiskLevel(riskLevel) {
        const levels = {
            low: 'Rendah',
            medium: 'Sedang',
            high: 'Tinggi',
            critical: 'Kritis'
        };
        return levels[riskLevel] || 'Tidak diketahui';
    }
}