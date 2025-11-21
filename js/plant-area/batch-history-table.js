// ========================================
// バッチ履歴テーブル関連処理
// ========================================

// フィルタリングされたデータを取得する関数
function getFilteredBatchHistoryData() {
    const data = getBatchHistoryData();
    
    // 検索条件を取得
    const startDate = document.getElementById('start-date')?.value;
    const endDate = document.getElementById('end-date')?.value;
    const selectedLine = document.getElementById('line-select')?.value;
    const selectedProject = document.getElementById('project-select')?.value;
    const productNoInput = document.getElementById('material-input')?.value.trim();
    
    // フィルタリング
    return data.filter(record => {
        // 日付フィルタリング（注文日時の日付部分を比較）
        if (startDate || endDate) {
            const orderDateStr = record.orderDateTime.split(' ')[0]; // "2025/10/01 08:00:00" -> "2025/10/01"
            const orderDateParts = orderDateStr.split('/');
            const orderDate = `${orderDateParts[0]}-${orderDateParts[1].padStart(2, '0')}-${orderDateParts[2].padStart(2, '0')}`; // "2025-10-01"
            
            if (startDate && orderDate < startDate) {
                return false;
            }
            if (endDate && orderDate > endDate) {
                return false;
            }
        }
        
        // ラインフィルタリング
        if (selectedLine && record.line !== selectedLine) {
            return false;
        }
        
        // プロジェクトフィルタリング
        if (selectedProject && record.projectName !== selectedProject) {
            return false;
        }
        
        // 製品番号フィルタリング（部分一致）
        if (productNoInput && !record.productNo.includes(productNoInput)) {
            return false;
        }
        
        return true;
    });
}

// バッチ履歴テーブルを動的に生成する関数
// applyFilter: trueの場合はフィルタリングを適用、falseの場合は全データを表示
function renderBatchHistoryTable(applyFilter = false) {
    const tbody = document.querySelector('#batch-history-screen .history-table tbody');
    if (!tbody) return;

    tbody.innerHTML = '';
    
    // フィルタリングを適用するかどうかでデータを取得
    const data = applyFilter ? getFilteredBatchHistoryData() : getBatchHistoryData();
    data.forEach(record => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${record.batchNo}</td>
            <td>${record.line}</td>
            <td>${record.projectName}</td>
            <td>${record.floor}</td>
            <td>${record.productNo}</td>
            <td>${record.formworkNo}</td>
            <td>${record.mix}</td>
            <td>${record.totalVolume}</td>
            <td>${record.concreteVolume}</td>
            <td>${record.mixNo}</td>
            <td>${record.orderDateTime}</td>
            <td>${record.completionDateTime}</td>
            <td>${record.mixer}</td>
        `;
        tbody.appendChild(row);
    });
}

// プロジェクト選択のオプションを動的に生成する関数
function updateProjectSelectOptions(factory) {
    const projectSelect = document.getElementById('project-select');
    if (!projectSelect) return;
    
    // 現在の選択値を保持
    const currentValue = projectSelect.value;
    
    // オプションをクリア（「全て」以外）
    while (projectSelect.options.length > 1) {
        projectSelect.remove(1);
    }
    
    // データからプロジェクト名を取得
    const data = getBatchHistoryData(factory);
    const projectNames = [...new Set(data.map(record => record.projectName))].sort();
    
    // オプションを追加
    projectNames.forEach(projectName => {
        const optionElement = document.createElement('option');
        optionElement.value = projectName;
        optionElement.textContent = projectName;
        projectSelect.appendChild(optionElement);
    });
    
    // 以前の選択値が新しいオプションに存在する場合は復元、そうでなければ「全て」を選択
    if (currentValue && projectNames.includes(currentValue)) {
        projectSelect.value = currentValue;
    } else {
        projectSelect.value = '';
    }
}

// 検索ボタンのイベント設定
function setupSearchButtonEvents() {
    const searchBtn = document.querySelector('#batch-history-screen .search-btn');
    if (searchBtn) {
        searchBtn.addEventListener('click', function() {
            // 検索ボタンクリック時はフィルタリングを適用
            renderBatchHistoryTable(true);
        });
    }
}

// 工場セレクターのイベント設定
function setupBatchHistoryFactorySelectorEvents() {
    const factorySelector = document.querySelector('#batch-history-screen .factory-selector');
    if (factorySelector) {
        // 初期化時にライン選択のオプションを更新
        updateLineSelectOptions(factorySelector.value);
        // 初期化時にプロジェクト選択のオプションを更新
        updateProjectSelectOptions(factorySelector.value);
        
        factorySelector.addEventListener('change', function() {
            // 工場選択が変更されたらライン選択のオプションを更新
            updateLineSelectOptions(this.value);
            // 工場選択が変更されたらプロジェクト選択のオプションを更新
            updateProjectSelectOptions(this.value);
            // テーブルを再描画（フィルタリングなしで全データ表示）
            renderBatchHistoryTable(false);
        });
    }
}

// ライン選択のオプションを工場に応じて更新する関数
function updateLineSelectOptions(factory) {
    const lineSelect = document.getElementById('line-select');
    if (!lineSelect) return;
    
    // 現在の選択値を保持
    const currentValue = lineSelect.value;
    
    // オプションをクリア（「全て」以外）
    while (lineSelect.options.length > 1) {
        lineSelect.remove(1);
    }
    
    // 工場に応じてラインオプションを追加
    let lineOptions = [];
    if (factory === 'ibaraki-factory') {
        lineOptions = [
            { value: '茨城_Aライン', text: '茨城_Aライン' },
            { value: '茨城_B1ライン', text: '茨城_B1ライン' },
            { value: '茨城_B2ライン', text: '茨城_B2ライン' },
            { value: '茨城_C1ライン', text: '茨城_C1ライン' },
            { value: '茨城_C2ライン', text: '茨城_C2ライン' },
            { value: '茨城_Dライン', text: '茨城_Dライン' }
        ];
    } else {
        // 栃木工場
        lineOptions = [
            { value: '栃木_建築A北', text: '栃木_建築A北' },
            { value: '栃木_建築B北', text: '栃木_建築B北' },
            { value: '栃木_南工場', text: '栃木_南工場' }
        ];
    }
    
    // オプションを追加
    lineOptions.forEach(option => {
        const optionElement = document.createElement('option');
        optionElement.value = option.value;
        optionElement.textContent = option.text;
        lineSelect.appendChild(optionElement);
    });
    
    // 以前の選択値が新しいオプションに存在する場合は復元、そうでなければ「全て」を選択
    if (currentValue && lineOptions.some(opt => opt.value === currentValue)) {
        lineSelect.value = currentValue;
    } else {
        lineSelect.value = '';
    }
}
