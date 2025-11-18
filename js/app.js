class LegalAIApp {
    constructor() {
        this.processor = new DocumentProcessor();
        this.ruleEngine = new RuleEngine();
        this.currentAnalysis = null;
        this.currentFile = null;
        
        this.initializeEventListeners();
        console.log('Legal AI App initialized');
    }

    initializeEventListeners() {
        const uploadArea = document.getElementById('uploadArea');
        const fileInput = document.getElementById('fileInput');
        const analyzeBtn = document.getElementById('analyzeBtn');
        const exportBtn = document.getElementById('exportBtn');

        uploadArea.addEventListener('click', () => fileInput.click());
        
        fileInput.addEventListener('change', (e) => this.handleFileSelect(e));

        uploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadArea.classList.add('dragover');
        });

        uploadArea.addEventListener('dragleave', () => {
            uploadArea.classList.remove('dragover');
        });

        uploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadArea.classList.remove('dragover');
            this.handleFileDrop(e);
        });

        analyzeBtn.addEventListener('click', () => this.analyzeDocument());
        exportBtn.addEventListener('click', () => this.exportReport());
    }

    handleFileSelect(event) {
        const file = event.target.files[0];
        if (file) {
            this.validateAndProcessFile(file);
        }
    }

    handleFileDrop(event) {
        const file = event.dataTransfer.files[0];
        if (file) {
            this.validateAndProcessFile(file);
        }
    }

    validateAndProcessFile(file) {
        const validTypes = ['text/plain', 'application/pdf', 'application/msword', 
                           'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
        
        if (!validTypes.includes(file.type) && !file.name.match(/\.(txt|pdf|doc|docx)$/i)) {
            alert('Format file tidak didukung. Silakan upload file .txt, .pdf, .doc, atau .docx');
            return;
        }

        this.showAnalysisControls();
        this.currentFile = file;
    }

    showAnalysisControls() {
        document.getElementById('analysisControls').style.display = 'block';
        document.getElementById('resultsSection').style.display = 'none';
    }

    async analyzeDocument() {
        if (!this.currentFile) {
            alert('Silakan pilih file terlebih dahulu');
            return;
        }

        const analyzeBtn = document.getElementById('analyzeBtn');
        const loading = document.getElementById('loading');

        analyzeBtn.disabled = true;
        loading.style.display = 'block';

        try {
            console.log('Starting document analysis...');
            this.currentAnalysis = await this.processor.processDocument(this.currentFile);
            console.log('Analysis completed:', this.currentAnalysis);
            
            this.displayResults();
            
        } catch (error) {
            console.error('Analysis error:', error);
            alert('Error dalam menganalisis dokumen: ' + error.message);
        } finally {
            analyzeBtn.disabled = false;
            loading.style.display = 'none';
        }
    }

    displayResults() {
        const analysis = this.currentAnalysis;
        
        document.getElementById('resultsSection').style.display = 'block';

        this.displayStats(analysis);
        this.displayRiskBadge(analysis.summary.riskLevel);
        this.displayClauses(analysis.clauses);
        this.displayIssues([...analysis.issues, ...analysis.risks]);
    }

    displayStats(analysis) {
        document.getElementById('statClauses').textContent = analysis.summary.totalClauses;
        document.getElementById('statIssues').textContent = analysis.summary.totalIssues + analysis.summary.totalRisks;
        document.getElementById('statScore').textContent = analysis.riskScore;
    }

    displayRiskBadge(riskLevel) {
        const riskBadge = document.getElementById('riskBadge');
        riskBadge.textContent = this.ruleEngine.formatRiskLevel(riskLevel);
        riskBadge.style.background = this.getRiskBackground(riskLevel);
        riskBadge.style.color = this.getRiskColor(riskLevel);
    }

    getRiskBackground(riskLevel) {
        const backgrounds = {
            low: '#d1fae5',
            medium: '#fef3c7',
            high: '#fee2e2', 
            critical: '#fecaca'
        };
        return backgrounds[riskLevel] || '#f3f4f6';
    }

    getRiskColor(riskLevel) {
        const colors = {
            low: '#065f46',
            medium: '#92400e',
            high: '#991b1b',
            critical: '#7f1d1d'
        };
        return colors[riskLevel] || '#374151';
    }

    displayClauses(clauses) {
        const clausesFound = document.getElementById('clausesFound');
        
        if (clauses.length === 0) {
            clausesFound.innerHTML = '<div class="empty-state">Tidak ada klausul standar yang terdeteksi</div>';
            return;
        }

        clausesFound.innerHTML = clauses.map(clause => `
            <div class="clause-item">
                <div class="clause-header">
                    ${clause.name}
                    <span class="risk-${clause.riskLevel}">${this.ruleEngine.formatRiskLevel(clause.riskLevel)}</span>
                </div>
                <div class="clause-content">
                    <strong>Kata kunci:</strong> ${clause.keywords.join(', ')}<br>
                    <strong>Kepercayaan:</strong> ${clause.confidence}%
                </div>
            </div>
        `).join('');
    }

    displayIssues(issues) {
        const issuesFound = document.getElementById('issuesFound');
        
        if (issues.length === 0) {
            issuesFound.innerHTML = '<div class="empty-state">Tidak ada masalah kritis yang terdeteksi</div>';
            return;
        }

        issuesFound.innerHTML = issues.map(issue => `
            <div class="issue-item">
                <div class="issue-header">
                    ${issue.description}
                    <span class="risk-${issue.riskLevel}">${this.ruleEngine.formatRiskLevel(issue.riskLevel)}</span>
                </div>
                ${issue.term ? `<div class="issue-content"><strong>Term:</strong> ${issue.term}</div>` : ''}
            </div>
        `).join('');
    }

    exportReport() {
        if (!this.currentAnalysis) return;

        const analysis = this.currentAnalysis;
        const report = {
            timestamp: new Date().toISOString(),
            fileName: this.currentFile.name,
            fileSize: this.currentFile.size,
            analysis: analysis
        };

        const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `legal_analysis_${Date.now()}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new LegalAIApp();
});