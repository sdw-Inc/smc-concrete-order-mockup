// ========================================
// 生産指示画面の処理
// ========================================

// 生産指示画面の初期化
function initializeProductionInstructionScreen() {
    try {
        // 基本設定
        updateDates();
        updateDateSelector();
        
        // イベント設定
        setupDateSelectorEvents();
        setupFactorySelectorEvents();
        setupLineSelectorEvents();
        setupBatcherFilterSelectorEvents();
        
        // データ初期化
        const initialFactorySelector = document.querySelector('.factory-selector');
        if (initialFactorySelector) {
            updateOrderTableData(initialFactorySelector.value);
        }
        
        // 表示更新（遅延実行）
        setTimeout(() => {
            updateDisplayFromData();
        }, 100);
        
        // バッチ分割機能の初期化
        initializeBatchDivision();
        
        // 練り指示確定ボタンのイベント設定
        setupConfirmMixingButton();
        
        // 注文テーブルの初期化
        initializeOrderTable();
        
        // 注文モーダルの初期化
        initializeOrderModal();
        
        // 空注文追加モーダルの初期化
        initializeEmptyOrderModal();
        
        // 注文追加ボタンのイベント設定
        setupAddOrderButton();
        
        // 注文追加ボタンの状態管理を初期化
        updateAddOrderButtonState();
        
        // 選択解除ボタンのイベント設定
        setupClearSelectionButton();
        
        // 練り指示ボタンのイベント設定
        setupMixingInstructionButtons();
        
        // 練り指示確定ボタンの初期状態を設定
        updateConfirmMixingInstructionButton();
        
        // 練り指示ボタンの初期状態を設定
        updateMixingInstructionButtons();
        
    } catch (error) {
        console.error('生産指示画面の初期化でエラーが発生しました:', error);
    }
}

// 日付セレクターのイベント設定
function setupDateSelectorEvents() {
    const dateSelector = document.getElementById('date-selector');
    if (dateSelector) {
        dateSelector.addEventListener('change', updateDatesFromSelector);
    }
}

// 工場セレクターのイベント設定
function setupFactorySelectorEvents() {
    const factorySelector = document.querySelector('.factory-selector');
    if (factorySelector) {
        // 初期化時に現在の選択値を反映
        updateLineSelectorOptions(factorySelector.value);
        
        // 初期化時にライン名を更新
        const lineSelector = document.getElementById('line-selector');
        if (lineSelector) {
            updateLineData(lineSelector.value);
        }
        
        // バッチモードのデフォルト値設定（即座に実行）
        try {
            updateBatchModeDefault(factorySelector.value);
        } catch (error) {
            console.error('バッチモードデフォルト値設定でエラー:', error);
        }
        
        // 練り混ぜ順エリアの初期表示設定
        updateMixingOrderDisplay(factorySelector.value);
        
        // 打設量テーブルの初期表示設定
        updatePouringVolumeTable(factorySelector.value);
        
        // 運搬指示エリアの初期表示設定
        updateTransportInstructionDisplay(factorySelector.value);
        
        // バッチャー選択selectorの初期表示設定
        updateBatcherFilterSelectorDisplay(factorySelector.value);
        
        // 練り指示確定ボタンのイベント設定
        setupConfirmMixingButton();
        
        factorySelector.addEventListener('change', function() {
            updateLineSelectorOptions(this.value);
            updateOrderTableData(this.value);
            
            // ライン名を更新
            const lineSelector = document.getElementById('line-selector');
            if (lineSelector) {
                updateLineData(lineSelector.value);
            }
            
            // 練り混ぜ順エリアの表示切り替え
            updateMixingOrderDisplay(this.value);
            
            // 打設量テーブルの更新
            updatePouringVolumeTable(this.value);
            
            // 運搬指示エリアの表示切り替え
            updateTransportInstructionDisplay(this.value);
            
            // バッチャー選択selectorの表示切り替え
            updateBatcherFilterSelectorDisplay(this.value);
            
            // 注文テーブルのイベントは再設定しない（重複防止）
            
            // バッチモードのデフォルト値設定（即座に実行）
            try {
                updateBatchModeDefault(this.value);
            } catch (error) {
                console.error('バッチモードデフォルト値設定でエラー:', error);
            }
            
            // 練り指示ボタンの状態を更新
            updateMixingInstructionButtons();
        });
    }
}

// ラインセレクターのイベント設定
function setupLineSelectorEvents() {
    const lineSelector = document.getElementById('line-selector');
    if (lineSelector) {
        // 初期化時に現在の選択値を反映
        updateLineData(lineSelector.value);
        
        lineSelector.addEventListener('change', function() {
            updateLineData(this.value);
        });
    }
}

// 注文追加ボタンのイベント設定
function setupAddOrderButton() {
    const addOrderBtn = document.getElementById('add-order-btn');
    if (addOrderBtn) {
        addOrderBtn.addEventListener('click', handleAddOrderClick);
    }
}

// 選択解除ボタンのイベント設定
function setupClearSelectionButton() {
    const clearBtn = document.querySelector('.clear-selection-btn');
    if (clearBtn) {
        clearBtn.addEventListener('click', function() {
            clearSelection();
        });
    }
}

// 練り指示ボタンのイベント設定
function setupMixingInstructionButtons() {
    const changeBtn = document.getElementById('change-mixing-instruction-btn');
    const deleteBtn = document.getElementById('delete-mixing-instruction-btn');
    const changeAfterBtn = document.getElementById('change-after-mixing-btn');
    
    if (changeBtn) {
        changeBtn.addEventListener('click', handleChangeMixingInstructionClick);
    }
    
    if (deleteBtn) {
        deleteBtn.addEventListener('click', handleDeleteMixingInstructionClick);
    }
    
    if (changeAfterBtn) {
        changeAfterBtn.addEventListener('click', handleChangeAfterMixingClick);
    }
}

// 日付更新関数（今日の日付を基準）
function updateDates() {
    const today = new Date();
    updateDatesFromDate(today);
}

// 指定された日付を基準に日付を更新
function updateDatesFromDate(baseDate) {
    const tomorrow = new Date(baseDate);
    tomorrow.setDate(baseDate.getDate() + 1);

    // 曜日の配列
    const weekdays = ['日', '月', '火', '水', '木', '金', '土'];

    // 基準日の日付をフォーマット
    const todayFormatted = `${String(baseDate.getMonth() + 1).padStart(2, '0')}/${String(baseDate.getDate()).padStart(2, '0')} ${weekdays[baseDate.getDay()]}`;
    
    // 翌日の日付をフォーマット
    const tomorrowFormatted = `${String(tomorrow.getMonth() + 1).padStart(2, '0')}/${String(tomorrow.getDate()).padStart(2, '0')} ${weekdays[tomorrow.getDay()]}`;

    // DOM要素を更新
    const todayElement = document.getElementById('today-date');
    const tomorrowElement = document.getElementById('tomorrow-date');
    
    if (todayElement) {
        todayElement.textContent = todayFormatted;
    }
    
    if (tomorrowElement) {
        tomorrowElement.textContent = tomorrowFormatted;
    }
}

// date-selectorの値に基づいて日付を更新
function updateDatesFromSelector() {
    const dateSelector = document.getElementById('date-selector');
    if (dateSelector && dateSelector.value) {
        const selectedDate = new Date(dateSelector.value);
        updateDatesFromDate(selectedDate);
    }
}

// date-selector更新関数
function updateDateSelector() {
    const today = new Date();
    const dateSelector = document.getElementById('date-selector');
    
    if (dateSelector) {
        // YYYY-MM-DD形式で今日の日付を設定
        const todayFormatted = today.toISOString().split('T')[0];
        dateSelector.value = todayFormatted;
    }
}

// ライン選択時のデータ更新関数
function updateLineData(selectedLine) {
    // row-labelのライン名を更新
    updateRowLabels(selectedLine);
    // データに基づいて表示を更新
    updateDisplayFromData();
}

// row-labelのライン名を更新する関数
function updateRowLabels(selectedLine) {
    const lineNames = document.querySelectorAll('.line-name');
    lineNames.forEach(lineName => {
        lineName.textContent = selectedLine;
    });
}

// factory-selectorに応じてline-selectorのoptionを更新する関数
function updateLineSelectorOptions(factoryValue) {
    const lineSelector = document.getElementById('line-selector');
    if (!lineSelector) return;

    // 既存のoptionをクリア
    lineSelector.innerHTML = '';

    let options = [];
    
    if (factoryValue === 'tochigi-factory') { // cspell:ignore tochigi
        // 栃木工場のライン
        options = [
            { value: '栃木_建築A北', text: '栃木_建築A北' },
            { value: '栃木_建築B北', text: '栃木_建築B北' },
            { value: '栃木_南工場', text: '栃木_南工場' },
            { value: '栃木_Nライン', text: '栃木_Nライン' },
            { value: '栃木_RC-Aライン', text: '栃木_RC-Aライン' },
            { value: '栃木_PC-Aライン', text: '栃木_PC-Aライン' },
            { value: '栃木_PC-Cライン', text: '栃木_PC-Cライン' },
            { value: '栃木_PC-0ライン', text: '栃木_PC-0ライン' },
            { value: '栃木_ポステンヤード', text: '栃木_ポステンヤード' },
            { value: '栃木_工事倉庫前ヤード', text: '栃木_工事倉庫前ヤード' },
            { value: '栃木_食堂前ヤード', text: '栃木_食堂前ヤード' },
            { value: '栃木_その他', text: '栃木_その他' }
        ];
    } else if (factoryValue === 'ibaraki-factory') { // cspell:ignore ibaraki
        // 茨城工場のライン
        options = [
            { value: '茨城_Aライン', text: '茨城_Aライン' },
            { value: '茨城_B1ライン', text: '茨城_B1ライン' },
            { value: '茨城_B2ライン', text: '茨城_B2ライン' },
            { value: '茨城_C1ライン', text: '茨城_C1ライン' },
            { value: '茨城_C2ライン', text: '茨城_C2ライン' },
            { value: '茨城_Dライン', text: '茨城_Dライン' },
            { value: '茨城_その他', text: '茨城_その他' }
        ];
    }

    // 新しいoptionを追加
    options.forEach(option => {
        const optionElement = document.createElement('option');
        optionElement.value = option.value;
        optionElement.textContent = option.text;
        lineSelector.appendChild(optionElement);
    });

    // 最初のoptionを選択して、line-nameを更新
    if (options.length > 0) {
        lineSelector.value = options[0].value;
        updateLineData(options[0].value);
    }
}

// 練り混ぜ順エリアの表示切り替え
function updateMixingOrderDisplay(factoryValue) {
    const tochigiContainer = document.getElementById('tochigi-mixing-order');
    const ibarakiContainer = document.getElementById('ibaraki-batch-schedule');
    
    if (factoryValue === 'tochigi-factory') {
        // 栃木工場選択時：練り混ぜ順テーブルを表示
        if (tochigiContainer) {
            tochigiContainer.style.display = 'flex';
            generateMixingOrderData();
            // 指示ボタンのイベントを再設定
            setupInstructionButtonEvents();
            // 行クリックイベントを設定
            setupMixingOrderRowClickEvents();
        }
        if (ibarakiContainer) {
            ibarakiContainer.style.display = 'none';
        }
        // 練り指示ボタンの状態を更新
        updateMixingInstructionButtons();
    } else if (factoryValue === 'ibaraki-factory') {
        // 茨城工場選択時：バッチ割付・練混予定テーブルを表示
        if (tochigiContainer) {
            tochigiContainer.style.display = 'none';
        }
        if (ibarakiContainer) {
            ibarakiContainer.style.display = 'flex';
            // ライン表示マップをリセット
            lineDisplayedOrderMap = {};
            generateBatchScheduleData();
            // セルクリックイベントを再設定
            setupBatchScheduleCellClickEvents();
        }
        // 練り指示ボタンの状態を更新
        updateMixingInstructionButtons();
    }
}

// 運搬指示エリアの表示切り替え
function updateTransportInstructionDisplay(factoryValue) {
    const transportArea = document.querySelector('.transport-instruction-area');
    const body = document.body;
    const standardPeriodContainer = document.querySelector('.standard-period-container');
    const standardPeriodParagraphs = standardPeriodContainer ? standardPeriodContainer.querySelectorAll('p') : [];
    
    if (factoryValue === 'ibaraki-factory') {
        // 茨城工場選択時：運搬指示エリアを非表示、bodyにクラス追加
        if (transportArea) {
            transportArea.classList.add('hidden');
        }
        body.classList.add('ibaraki-factory');
        body.classList.remove('tochigi-factory');
        // 標準期コンテナ内のp要素を非表示
        standardPeriodParagraphs.forEach(p => {
            p.style.display = 'none';
        });
    } else if (factoryValue === 'tochigi-factory') {
        // 栃木工場選択時：運搬指示エリアを表示、bodyにクラス追加
        if (transportArea) {
            transportArea.classList.remove('hidden');
        }
        body.classList.add('tochigi-factory');
        body.classList.remove('ibaraki-factory');
        // 標準期コンテナ内のp要素を表示
        standardPeriodParagraphs.forEach(p => {
            p.style.display = '';
        });
    }
}

// 栃木工場用：練り混ぜ順データの生成
function generateMixingOrderData() {
    const tbody = document.getElementById('mixing-order-tbody');
    if (!tbody) return;
    
    // サンプルデータ（添付画像に基づく）
    const mixingOrderData = [
        { line: '栃木_建築A北', project: '川崎柱', batchNo: '1-1', strength: '60N', m3: '1.3', time: '6:05', isCompleted: true },
        { line: '栃木_建築A北', project: '川崎柱', batchNo: '1-2', strength: '60N', m3: '1.3', time: '6:15', isCompleted: true },
        { line: '栃木_建築A北', project: '川崎柱', batchNo: '1-3', strength: '60N', m3: '1.3', time: '6:25' },
        { line: '栃木_建築A北', project: '川崎柱', batchNo: '1-4', strength: '60N', m3: '1.3', time: '6:35' },
        { line: '栃木_建築A北', project: '川崎柱', batchNo: '1-5', strength: '60N', m3: '1.3', time: '6:45' },
        { line: '栃木_建築A北', project: '川崎柱', batchNo: '1-6', strength: '60N', m3: '1.3', time: '6:55' },
        { line: '栃木_建築A北', project: '川崎柱', batchNo: '1-7', strength: '60N', m3: '1.3', time: '7:05' },
        { line: '栃木_建築A北', project: '川崎柱', batchNo: '1-8', strength: '60N', m3: '1.3', time: '7:15' },
        { line: '栃木_建築A北', project: '川崎柱', batchNo: '1-9', strength: '60N', m3: '1.0', time: '7:25' },
        { line: '栃木_建築B北', project: '世田谷小梁', batchNo: '2-1', strength: '30N', m3: '1.3', time: '7:32' },
        { line: '栃木_建築B北', project: '世田谷小梁', batchNo: '2-2', strength: '30N', m3: '1.3', time: '7:42' },
        { line: '栃木_建築B北', project: '世田谷小梁', batchNo: '2-3', strength: '30N', m3: '1.3', time: '7:52' },
        { line: '栃木_建築B北', project: '世田谷小梁', batchNo: '2-4', strength: '30N', m3: '1.3', time: '8:02' },
        { line: '栃木_建築B北', project: '世田谷小梁', batchNo: '2-5', strength: '30N', m3: '0.8', time: '8:12' },
        { line: '栃木_南工場', project: '幕張GB', batchNo: '3-1', strength: '70N', m3: '1.3', time: '8:27' },
        { line: '栃木_南工場', project: '幕張GB', batchNo: '3-2', strength: '70N', m3: '1.3', time: '8:37' },
        { line: '栃木_南工場', project: '幕張GB', batchNo: '3-3', strength: '70N', m3: '1.2', time: '8:47' }
    ];
    
    tbody.innerHTML = '';
    
    mixingOrderData.forEach((item, index) => {
        const row = document.createElement('tr');
        const m3Value = parseFloat(item.m3).toFixed(2);
        const isCompleted = item.isCompleted || false;
        
        // 変更依頼数量を取得
        const changeRequestVolume = getChangeRequestVolume('tochigi-factory', item.line, item.batchNo);
        const hasChangeRequest = changeRequestVolume !== null;
        
        // 練り上がり済みの場合はcompletedクラスを追加
        if (isCompleted) {
            row.classList.add('completed');
        }
        
        // 変更依頼がある場合はchange-requestクラスを追加
        if (hasChangeRequest) {
            row.classList.add('change-request');
            row.setAttribute('data-change-request', 'true');
            row.setAttribute('data-change-request-volume', changeRequestVolume.toFixed(2));
        }
        
        row.innerHTML = `
            <td>${item.line}</td>
            <td>${item.project}</td>
            <td>${item.batchNo}</td>
            <td>${item.strength}</td>
            <td>${m3Value}</td>
            <td>${item.time}</td>
            <td><button class="instruction-btn" data-index="${index}" ${isCompleted ? 'disabled' : ''}>${isCompleted ? '完了' : '指示'}</button></td>
        `;
        
        // 練り上がり済みの場合は指示ボタンのスタイルを設定
        if (isCompleted) {
            const instructionBtn = row.querySelector('.instruction-btn');
            if (instructionBtn) {
                instructionBtn.style.color = '#666666';
            }
        }
        
        tbody.appendChild(row);
    });
    
    // 指示ボタンのクリックイベントを設定
    setupInstructionButtonEvents();
    // 行クリックイベントを設定
    setupMixingOrderRowClickEvents();
}

// 各ラインごとに表示している注文情報を保持するオブジェクト
// キー: ライン名（例: '茨城_Aライン'）、値: { orderNo, project } のオブジェクト
let lineDisplayedOrderMap = {};

// 変更依頼データの管理
// キー: 工場名、値: バッチNoをキーとした変更依頼数量のマップ
const changeRequestData = {
    'tochigi-factory': {
        '1-9': 0.5,
        '2-5': 1.0
    },
    'ibaraki-factory': {
        '茨城_B1ライン': {
            '2-7': 1.0,
            '2-8': 0.3
        }
    }
};

// 変更依頼数量を取得する関数
function getChangeRequestVolume(factory, line, batchNo) {
    if (!changeRequestData[factory]) {
        return null;
    }
    
    if (factory === 'tochigi-factory') {
        return changeRequestData[factory][batchNo] || null;
    } else if (factory === 'ibaraki-factory') {
        if (changeRequestData[factory][line] && changeRequestData[factory][line][batchNo]) {
            return changeRequestData[factory][line][batchNo];
        }
        return null;
    }
    
    return null;
}

// 変更依頼データを削除する関数
function removeChangeRequestData(factory, line, batchNo) {
    if (!changeRequestData[factory]) {
        return;
    }
    
    if (factory === 'tochigi-factory') {
        if (changeRequestData[factory][batchNo]) {
            delete changeRequestData[factory][batchNo];
        }
    } else if (factory === 'ibaraki-factory') {
        if (changeRequestData[factory][line] && changeRequestData[factory][line][batchNo]) {
            delete changeRequestData[factory][line][batchNo];
        }
    }
}

// 茨城工場用：バッチ割付・練混予定データの生成
// targetLineName: 更新対象のライン名（指定された場合、そのラインのみ更新）
function generateBatchScheduleData(targetLineName = null) {
    const tbody = document.getElementById('batch-schedule-tbody');
    if (!tbody) return;
    
    // orderDataから茨城工場のデータを取得
    if (!orderData || !orderData['ibaraki-factory']) {
        // 空のテーブルを表示
        tbody.innerHTML = '';
        const strengthRow = document.createElement('tr');
        for (let i = 0; i < 7; i++) {
            strengthRow.innerHTML += '<td></td>';
        }
        tbody.appendChild(strengthRow);
        const emptyRow = document.createElement('tr');
        for (let i = 0; i < 7; i++) {
            emptyRow.innerHTML += '<td style="border: none; background: transparent;"></td>';
        }
        tbody.appendChild(emptyRow);
        setupBatchScheduleCellClickEvents();
        return;
    }
    
    const ibarakiData = orderData['ibaraki-factory'];
    
    // ライン名から列キーへのマッピング
    const lineToColumnKey = {
        '茨城_Aライン': 'A',
        '茨城_B1ライン': 'B1',
        '茨城_B2ライン': 'B2',
        '茨城_C1ライン': 'C1',
        '茨城_C2ライン': 'C2',
        '茨城_Dライン': 'D',
        '茨城_その他': 'その他'
    };
    
    // 特定のラインのみ更新する場合
    if (targetLineName) {
        updateSingleLineInBatchSchedule(targetLineName, ibarakiData, lineToColumnKey);
        return;
    }
    
    // 全ラインを更新する場合（初期化時など）
    // 各ラインごとに表示する注文を決定
    const lineOrdersMap = {};
    
    Object.keys(lineToColumnKey).forEach(lineName => {
        const lineOrders = ibarakiData[lineName] || [];
        
        // 既に表示中の注文情報がある場合はそれを使用
        if (lineDisplayedOrderMap[lineName]) {
            const displayedOrderInfo = lineDisplayedOrderMap[lineName];
            const displayedOrder = lineOrders.find(order => 
                String(order.orderNo) === String(displayedOrderInfo.orderNo) && 
                order.project === displayedOrderInfo.project
            );
            
            if (displayedOrder && displayedOrder.batches && Array.isArray(displayedOrder.batches) && displayedOrder.batches.length > 0) {
                lineOrdersMap[lineName] = displayedOrder;
                return;
            }
        }
        
        // 表示中の注文がない場合は、completedの注文を表示
        const completedOrders = lineOrders.filter(order => order.batchStatus === 'completed' && order.batches && Array.isArray(order.batches) && order.batches.length > 0);
        
        if (completedOrders.length === 0) {
            lineOrdersMap[lineName] = null;
            lineDisplayedOrderMap[lineName] = null;
        } else if (completedOrders.length === 1) {
            // 1つの場合はその注文を使用
            lineOrdersMap[lineName] = completedOrders[0];
            lineDisplayedOrderMap[lineName] = {
                orderNo: completedOrders[0].orderNo,
                project: completedOrders[0].project
            };
        } else {
            // 複数の場合は最初の注文を使用
            lineOrdersMap[lineName] = completedOrders[0];
            lineDisplayedOrderMap[lineName] = {
                orderNo: completedOrders[0].orderNo,
                project: completedOrders[0].project
            };
        }
    });
    
    // 各ラインのバッチデータを取得し、最大行数を計算
    const lineBatchDataMap = {};
    let maxRowCount = 0;
    
    Object.keys(lineOrdersMap).forEach(lineName => {
        const order = lineOrdersMap[lineName];
        if (order && order.batches && Array.isArray(order.batches) && order.batches.length > 0) {
            lineBatchDataMap[lineName] = order.batches;
            maxRowCount = Math.max(maxRowCount, order.batches.length);
        }
    });
    
    // バッチデータがない場合でも、少なくとも1行の空行を表示
    if (maxRowCount === 0) {
        maxRowCount = 1;
    }
    
    tbody.innerHTML = '';
    
    // 強度行を生成（1行目）
    const strengthRow = document.createElement('tr');
    const columnKeys = ['A', 'B1', 'B2', 'C1', 'C2', 'D', 'その他'];
    columnKeys.forEach(columnKey => {
        const lineName = Object.keys(lineToColumnKey).find(key => lineToColumnKey[key] === columnKey);
        const order = lineOrdersMap[lineName];
        const strength = order && order.strength ? order.strength : '';
        strengthRow.innerHTML += `<td>${strength}</td>`;
    });
    tbody.appendChild(strengthRow);
    
    // バッチデータ行を生成（2行目以降）
    for (let rowIndex = 0; rowIndex < maxRowCount; rowIndex++) {
        const row = document.createElement('tr');
        
        columnKeys.forEach(columnKey => {
            const lineName = Object.keys(lineToColumnKey).find(key => lineToColumnKey[key] === columnKey);
            const batches = lineBatchDataMap[lineName];
            const order = lineOrdersMap[lineName];
            
            if (batches && batches[rowIndex]) {
                const batch = batches[rowIndex];
                const m3Value = parseFloat(batch.m3 || batch.volume || 0).toFixed(2);
                const batchNo = batch.batchNo || `${order.orderNo}-${rowIndex + 1}`;
                const strength = batch.strength || order.strength || '';
                const project = batch.project || order.project || '';
                const isCompleted = batch.isCompleted || false;
                
                // 変更依頼数量を取得
                const changeRequestVolume = getChangeRequestVolume('ibaraki-factory', lineName, batchNo);
                const hasChangeRequest = changeRequestVolume !== null;
                
                const cell = document.createElement('td');
                cell.className = 'clickable-cell';
                if (isCompleted) {
                    cell.classList.add('completed');
                    cell.style.backgroundColor = '#cccccc';
                    cell.style.cursor = 'not-allowed';
                }
                
                // 変更依頼がある場合はchange-requestクラスを追加
                if (hasChangeRequest) {
                    cell.classList.add('change-request');
                    cell.setAttribute('data-change-request', 'true');
                    cell.setAttribute('data-change-request-volume', changeRequestVolume.toFixed(2));
                }
                
                cell.setAttribute('data-batch-no', batchNo);
                cell.setAttribute('data-strength', strength);
                cell.setAttribute('data-volume', m3Value);
                cell.setAttribute('data-line', lineName);
                cell.setAttribute('data-project', project);
                cell.setAttribute('data-is-completed', isCompleted.toString());
                cell.textContent = m3Value;
                
                row.appendChild(cell);
            } else {
                // データがない場合は空セル（枠線を透明にする）
                const emptyCell = document.createElement('td');
                emptyCell.style.border = 'none';
                emptyCell.style.background = 'transparent';
                row.appendChild(emptyCell);
            }
        });
        
        tbody.appendChild(row);
    }
    
    // セルクリックイベントを設定
    setupBatchScheduleCellClickEvents();
    
    // 既に選択されているセルがある場合は、対応するorder-tableの行も選択状態にする
    syncOrderTableRowSelectionFromBatchSchedule();
}

// ラインをデフォルト表示に戻す関数
function resetLineToDefaultDisplay(targetLineName) {
    if (!orderData || !orderData['ibaraki-factory']) {
        return;
    }
    
    const ibarakiData = orderData['ibaraki-factory'];
    const lineOrders = ibarakiData[targetLineName] || [];
    
    // completedの注文を取得
    const completedOrders = lineOrders.filter(order => order.batchStatus === 'completed' && order.batches && Array.isArray(order.batches) && order.batches.length > 0);
    
    if (completedOrders.length > 0) {
        // 最初のcompleted注文を表示
        const defaultOrder = completedOrders[0];
        lineDisplayedOrderMap[targetLineName] = {
            orderNo: defaultOrder.orderNo,
            project: defaultOrder.project
        };
        
        // ライン名から列キーへのマッピング
        const lineToColumnKey = {
            '茨城_Aライン': 'A',
            '茨城_B1ライン': 'B1',
            '茨城_B2ライン': 'B2',
            '茨城_C1ライン': 'C1',
            '茨城_C2ライン': 'C2',
            '茨城_Dライン': 'D',
            '茨城_その他': 'その他'
        };
        
        // そのラインのみを更新
        updateSingleLineInBatchSchedule(targetLineName, ibarakiData, lineToColumnKey);
    } else {
        // completed注文がない場合は表示をクリア
        lineDisplayedOrderMap[targetLineName] = null;
        
        const lineToColumnKey = {
            '茨城_Aライン': 'A',
            '茨城_B1ライン': 'B1',
            '茨城_B2ライン': 'B2',
            '茨城_C1ライン': 'C1',
            '茨城_C2ライン': 'C2',
            '茨城_Dライン': 'D',
            '茨城_その他': 'その他'
        };
        
        const columnKey = lineToColumnKey[targetLineName];
        if (columnKey) {
            const tbody = document.getElementById('batch-schedule-tbody');
            if (tbody) {
                const columnKeys = ['A', 'B1', 'B2', 'C1', 'C2', 'D', 'その他'];
                const columnIndex = columnKeys.indexOf(columnKey);
                
                if (columnIndex !== -1) {
                    // 強度行をクリア
                    const strengthRow = tbody.querySelector('tr:first-child');
                    if (strengthRow && strengthRow.children[columnIndex]) {
                        strengthRow.children[columnIndex].textContent = '';
                    }
                    
                    // バッチデータ行をクリア
                    const batchRows = Array.from(tbody.querySelectorAll('tr')).slice(1);
                    batchRows.forEach(row => {
                        const cell = row.children[columnIndex];
                        if (cell) {
                            cell.textContent = '';
                            cell.className = '';
                            cell.style.border = 'none';
                            cell.style.background = 'transparent';
                            cell.removeAttribute('data-batch-no');
                            cell.removeAttribute('data-strength');
                            cell.removeAttribute('data-volume');
                            cell.removeAttribute('data-line');
                            cell.removeAttribute('data-project');
                            cell.removeAttribute('data-is-completed');
                        }
                    });
                }
            }
        }
    }
}

// 特定のラインのみを更新する関数
function updateSingleLineInBatchSchedule(targetLineName, ibarakiData, lineToColumnKey) {
    const tbody = document.getElementById('batch-schedule-tbody');
    if (!tbody) return;
    
    // order-tableから選択されている行を取得
    const selectedRow = document.querySelector('.order-table tbody tr.selected');
    let selectedOrderInfo = null;
    if (selectedRow && typeof extractOrderInfoFromRow === 'function') {
        try {
            selectedOrderInfo = extractOrderInfoFromRow(selectedRow);
        } catch (error) {
            console.warn('extractOrderInfoFromRowでエラーが発生しました:', error);
        }
    }
    
    // デバッグ用ログ（Aラインの問題を調査）
    if (targetLineName && targetLineName.includes('Aライン')) {
        console.log('updateSingleLineInBatchSchedule - Aライン: 比較前', {
            targetLineName: targetLineName,
            selectedOrderInfo: selectedOrderInfo,
            selectedOrderInfoLine: selectedOrderInfo ? selectedOrderInfo.line : null,
            match: selectedOrderInfo ? selectedOrderInfo.line === targetLineName : false,
            selectedOrderInfoLineType: selectedOrderInfo ? typeof selectedOrderInfo.line : null,
            targetLineNameType: typeof targetLineName
        });
    }
    
    // 選択された行がない場合、lineDisplayedOrderMapから表示すべき注文情報を取得
    let orderToDisplay = null;
    // ライン名の比較（trimして比較、念のため）
    const selectedLine = selectedOrderInfo ? selectedOrderInfo.line.trim() : null;
    const targetLine = targetLineName ? targetLineName.trim() : null;
    const lineMatches = selectedLine === targetLine;
    
    if (!selectedOrderInfo || !lineMatches) {
        // デバッグ用ログ
        if (targetLineName && targetLineName.includes('Aライン')) {
            console.log('updateSingleLineInBatchSchedule - Aライン: マッチしませんでした', {
                selectedOrderInfoLine: selectedOrderInfo ? selectedOrderInfo.line : null,
                targetLineName: targetLineName,
                selectedOrderInfoExists: !!selectedOrderInfo
            });
        }
        
        // 選択された行が対象ラインでない場合、lineDisplayedOrderMapから取得
        if (lineDisplayedOrderMap[targetLineName]) {
            const displayedOrderInfo = lineDisplayedOrderMap[targetLineName];
            const lineOrders = ibarakiData[targetLineName] || [];
            orderToDisplay = lineOrders.find(order => 
                String(order.orderNo) === String(displayedOrderInfo.orderNo) && 
                order.project === displayedOrderInfo.project
            );
        }
        
        // デバッグ用ログ
        if (targetLineName && targetLineName.includes('Aライン')) {
            console.log('updateSingleLineInBatchSchedule - Aライン: lineDisplayedOrderMapから取得', {
                targetLineName: targetLineName,
                lineDisplayedOrderMap: lineDisplayedOrderMap[targetLineName],
                orderToDisplay: orderToDisplay
            });
        }
        
        // lineDisplayedOrderMapにも情報がない場合は何もしない
        if (!orderToDisplay) {
            return;
        }
    } else {
        // 選択された行が対象ラインの場合
        const lineOrders = ibarakiData[targetLineName] || [];
        orderToDisplay = lineOrders.find(order => 
            String(order.orderNo) === String(selectedOrderInfo.orderNo) && 
            order.project === selectedOrderInfo.project
        );
        
        // デバッグ用ログ
        if (targetLineName && targetLineName.includes('Aライン')) {
            console.log('updateSingleLineInBatchSchedule - Aライン: 選択行から取得', {
                targetLineName: targetLineName,
                selectedOrderInfo: selectedOrderInfo,
                orderToDisplay: orderToDisplay
            });
        }
    }
    
    const selectedOrder = orderToDisplay;
    
    // 選択された注文が存在する場合、バッチ割の有無に関わらず処理を続行
    if (selectedOrder) {
        // 表示中の注文情報を更新
        lineDisplayedOrderMap[targetLineName] = {
            orderNo: selectedOrder.orderNo,
            project: selectedOrder.project
        };
        
        // 列キーを取得
        const columnKey = lineToColumnKey[targetLineName];
        if (!columnKey) {
            console.warn('updateSingleLineInBatchSchedule: 列キーが見つかりません', targetLineName);
            return;
        }
        
        // 列インデックスを取得
        const columnKeys = ['A', 'B1', 'B2', 'C1', 'C2', 'D', 'その他'];
        const columnIndex = columnKeys.indexOf(columnKey);
        if (columnIndex === -1) {
            console.warn('updateSingleLineInBatchSchedule: 列インデックスが見つかりません', {
                columnKey: columnKey,
                targetLineName: targetLineName,
                columnKeys: columnKeys
            });
            return;
        }
        
        // デバッグ用ログ（Aラインの問題を調査）
        if (targetLineName && targetLineName.includes('Aライン')) {
            console.log('updateSingleLineInBatchSchedule - Aライン: 列情報', {
                columnKey: columnKey,
                columnIndex: columnIndex,
                targetLineName: targetLineName
            });
        }
        
        // 既存のバッチデータ行を取得
        const batchRows = Array.from(tbody.querySelectorAll('tr')).slice(1); // 1行目（強度行）を除外
        
        // バッチ割されている場合
        if (selectedOrder.batches && Array.isArray(selectedOrder.batches) && selectedOrder.batches.length > 0) {
            // 強度行を更新
            const strengthRow = tbody.querySelector('tr:first-child');
            if (strengthRow && strengthRow.children[columnIndex]) {
                strengthRow.children[columnIndex].textContent = selectedOrder.strength || '';
            }
            
            // 選択された注文のバッチ数
            const batchCount = selectedOrder.batches.length;
            
            // 既存の行数を確認し、必要に応じて行を追加
            while (batchRows.length < batchCount) {
                const newRow = document.createElement('tr');
                columnKeys.forEach(() => {
                    const emptyCell = document.createElement('td');
                    emptyCell.style.border = 'none';
                    emptyCell.style.background = 'transparent';
                    newRow.appendChild(emptyCell);
                });
                tbody.appendChild(newRow);
                batchRows.push(newRow);
            }
            
            // 対象列のセルを更新
            selectedOrder.batches.forEach((batch, batchIndex) => {
                if (batchIndex < batchRows.length) {
                    const row = batchRows[batchIndex];
                    let cell = row.children[columnIndex];
                    
                    // セルが存在しない、または空セルの場合は新規作成
                    if (!cell || !cell.classList.contains('clickable-cell')) {
                        // 既存のセルを削除
                        if (cell) {
                            cell.remove();
                        }
                        // 新しいセルを作成
                        cell = document.createElement('td');
                        row.insertBefore(cell, row.children[columnIndex] || null);
                    }
                    
                    const m3Value = parseFloat(batch.m3 || batch.volume || 0).toFixed(2);
                    const batchNo = batch.batchNo || `${selectedOrder.orderNo}-${batchIndex + 1}`;
                    const strength = batch.strength || selectedOrder.strength || '';
                    const project = batch.project || selectedOrder.project || '';
                    const isCompleted = batch.isCompleted || false;
                    
                    // 変更依頼数量を取得
                    const changeRequestVolume = getChangeRequestVolume('ibaraki-factory', targetLineName, batchNo);
                    const hasChangeRequest = changeRequestVolume !== null;
                    
                    cell.className = 'clickable-cell';
                    if (isCompleted) {
                        cell.classList.add('completed');
                        cell.style.backgroundColor = '#cccccc';
                        cell.style.cursor = 'not-allowed';
                    } else {
                        // isCompletedがfalseの場合はcompletedクラスとスタイルを削除
                        cell.classList.remove('completed');
                        cell.style.backgroundColor = '';
                        cell.style.cursor = '';
                    }
                    
                    // 変更依頼がある場合はchange-requestクラスを追加
                    if (hasChangeRequest) {
                        cell.classList.add('change-request');
                        cell.setAttribute('data-change-request', 'true');
                        cell.setAttribute('data-change-request-volume', changeRequestVolume.toFixed(2));
                    }
                    
                    cell.setAttribute('data-batch-no', batchNo);
                    cell.setAttribute('data-strength', strength);
                    cell.setAttribute('data-volume', m3Value);
                    cell.setAttribute('data-line', targetLineName);
                    cell.setAttribute('data-project', project);
                    cell.setAttribute('data-is-completed', isCompleted.toString());
                    cell.textContent = m3Value;
                    // 既存のCSSスタイルを維持するため、borderとbackgroundの設定を削除
                }
            });
            
            // バッチ数より多い行のセルを空にする
            for (let i = batchCount; i < batchRows.length; i++) {
                const row = batchRows[i];
                const cell = row.children[columnIndex];
                if (cell) {
                    cell.textContent = '';
                    cell.className = '';
                    cell.style.border = 'none';
                    cell.style.background = 'transparent';
                    cell.removeAttribute('data-batch-no');
                    cell.removeAttribute('data-strength');
                    cell.removeAttribute('data-volume');
                    cell.removeAttribute('data-line');
                    cell.removeAttribute('data-project');
                    cell.removeAttribute('data-is-completed');
                }
            }
        } else {
            // バッチ割されていない場合：強度とバッチは表示しない
            // 強度行を空にする
            const strengthRow = tbody.querySelector('tr:first-child');
            if (strengthRow && strengthRow.children[columnIndex]) {
                strengthRow.children[columnIndex].textContent = '';
            }
            
            // 全てのバッチデータ行のセルを空にする
            batchRows.forEach(row => {
                const cell = row.children[columnIndex];
                if (cell) {
                    cell.textContent = '';
                    cell.className = '';
                    cell.style.border = 'none';
                    cell.style.background = 'transparent';
                    cell.removeAttribute('data-batch-no');
                    cell.removeAttribute('data-strength');
                    cell.removeAttribute('data-volume');
                    cell.removeAttribute('data-line');
                    cell.removeAttribute('data-project');
                    cell.removeAttribute('data-is-completed');
                }
            });
        }
        
        // セルクリックイベントを再設定
        setupBatchScheduleCellClickEvents();
        
        // 既に選択されているセルがある場合は、対応するorder-tableの行も選択状態にする
        syncOrderTableRowSelectionFromBatchSchedule();
    }
}

// 茨城工場用：バッチ割付・練混予定テーブルのセルクリックイベント設定
function setupBatchScheduleCellClickEvents() {
    // 既存のイベントリスナーを削除（イベント委譲を使用）
    const tbody = document.getElementById('batch-schedule-tbody');
    if (tbody) {
        // 既存のイベントリスナーを削除
        tbody.removeEventListener('click', handleBatchScheduleCellClickEvent);
        // 新しいイベントリスナーを設定（イベント委譲）
        tbody.addEventListener('click', handleBatchScheduleCellClickEvent);
    }
}

// batch-schedule-tableで選択されているセルに対応するorder-tableの行を選択状態にする関数
function syncOrderTableRowSelectionFromBatchSchedule() {
    // 茨城工場選択時のみ処理
    const factorySelector = document.querySelector('.factory-selector');
    if (!factorySelector || factorySelector.value !== 'ibaraki-factory') {
        return;
    }
    
    // 選択されているセルを取得
    const selectedCells = document.querySelectorAll('#batch-schedule-tbody .clickable-cell.selected');
    
    if (selectedCells.length === 0) {
        // 選択されているセルがない場合でも、order-tableに選択されている行がある場合はクリアしない
        // （order-tableの行を直接選択した場合は、その選択状態を維持するため）
        // ただし、batch-schedule-tableのセルが選択解除された場合は、order-tableの行の選択もクリアする
        // この関数は、batch-schedule-tableのデータ更新時に呼び出されるため、
        // セルが選択されていない場合は、order-tableの行の選択をクリアしない
        // （order-tableの行を直接選択した場合は、その選択状態を維持する）
        return;
    }
    
    // 最初の選択されているセルを使用
    const selectedCell = selectedCells[0];
    const line = selectedCell.getAttribute('data-line');
    const project = selectedCell.getAttribute('data-project');
    const batchNo = selectedCell.getAttribute('data-batch-no');
    
    if (!line || !project || !batchNo) {
        return;
    }
    
    // バッチNoから注文Noを抽出（例：'1-1' → '1'）
    const batchNoParts = batchNo.split('-');
    const orderNo = batchNoParts.length > 1 ? batchNoParts[0] : batchNo;
    
    // order-tableの行を選択状態にする
    if (typeof selectOrderTableRowByOrderInfo === 'function') {
        selectOrderTableRowByOrderInfo(orderNo, line, project);
    }
}

// 茨城工場用：イベント委譲によるセルクリック処理
function handleBatchScheduleCellClickEvent(event) {
    const cell = event.target;
    // td要素を取得（セル内のテキストをクリックした場合も対応）
    const tdCell = cell.closest('td');
    
    // clickable-cellクラスがないセル（空セル）をクリックした場合は何もしない
    if (!tdCell || !tdCell.classList.contains('clickable-cell')) {
        // 空セルや行をクリックした場合はイベントを停止して何もしない
        event.stopPropagation();
        return;
    }
    
    // クリック可能なセルのみ処理
    handleBatchScheduleCellClick(tdCell);
}

// 茨城工場用：バッチ割付・練混予定テーブルのセルクリック処理
function handleBatchScheduleCellClick(cell) {
    // 既に選択されている場合は選択解除
    if (cell.classList.contains('selected')) {
        cell.classList.remove('selected');
        // 対応するorder-tableの行の選択も解除
        clearOrderTableRowSelection();
        clearMixingInstructionArea();
        return;
    }
    
    // 茨城工場のすべてのセルの選択状態をクリア（より確実な方法）
    const allIbarakiCells = document.querySelectorAll('#batch-schedule-tbody td');
    allIbarakiCells.forEach(c => {
        c.classList.remove('selected');
    });
    
    // 茨城工場の行全体の選択状態もクリア（念のため）
    const allIbarakiRows = document.querySelectorAll('#batch-schedule-tbody tr');
    allIbarakiRows.forEach(row => {
        row.classList.remove('selected');
    });
    
    // 栃木工場の選択状態もクリア
    const allTochigiRows = document.querySelectorAll('#mixing-order-tbody tr');
    allTochigiRows.forEach(row => {
        row.classList.remove('selected');
    });
    
    // order-tableの行の選択もクリア
    clearOrderTableRowSelection();
    
    // データを取得
    const data = {
        batchNo: cell.getAttribute('data-batch-no'),
        line: cell.getAttribute('data-line'),
        project: cell.getAttribute('data-project'),
        strength: cell.getAttribute('data-strength'),
        volume: cell.getAttribute('data-volume'),
        m3: cell.getAttribute('data-volume'), // 互換性のため
        isCompleted: cell.getAttribute('data-is-completed') === 'true' || cell.classList.contains('completed'),
        changeRequestVolume: cell.getAttribute('data-change-request-volume') ? parseFloat(cell.getAttribute('data-change-request-volume')) : null
    };
    
    if (!data.batchNo || !data.line || !data.project) {
        return;
    }
    
    // バッチデータのインデックスを計算（orderDataから該当するバッチを探す）
    let batchIndex = -1;
    let orderNo = null;
    if (orderData && orderData['ibaraki-factory'] && orderData['ibaraki-factory'][data.line]) {
        const lineOrders = orderData['ibaraki-factory'][data.line];
        const order = lineOrders.find(o => o.project === data.project && o.batchStatus === 'completed');
        if (order && order.batches && Array.isArray(order.batches)) {
            batchIndex = order.batches.findIndex(batch => batch.batchNo === data.batchNo);
            orderNo = order.orderNo;
        }
    }
    
    // セルを選択状態にする
    cell.classList.add('selected');
    
    // 対応するorder-tableの行を選択状態にする
    if (orderNo && data.line && data.project) {
        selectOrderTableRowByOrderInfo(orderNo, data.line, data.project);
    }
    
    // 完了セルの場合は練混指示エリアを更新しない（何も表示しない）
    if (data.isCompleted) {
        // 練混指示エリアをクリア（表示を'-'にする）
        document.getElementById('instruction-batch-no').textContent = '-';
        document.getElementById('instruction-line').textContent = '-';
        document.getElementById('instruction-project').textContent = '-';
        document.getElementById('instruction-strength').textContent = '-';
        document.getElementById('instruction-mix-no').value = '';
        document.getElementById('instruction-mix-no').placeholder = '調合No';
        document.getElementById('instruction-mixer-no').value = '';
        document.getElementById('standard-period-value').textContent = '-';
        
        // 現在選択中のデータを保存（ボタンの有効/無効制御のため）
        window.currentSelectedData = {
            factory: 'ibaraki',
            index: batchIndex,
            data: data
        };
    } else {
        // 未完了セルの場合は通常通り練混指示エリアを更新
        updateMixingInstructionArea(data, 'ibaraki', batchIndex);
        updateRowSelection('ibaraki', cell);
        
        // 現在選択中のデータを保存
        window.currentSelectedData = {
            factory: 'ibaraki',
            index: batchIndex,
            data: data
        };
    }
    
    // ボタンの有効/無効を更新
    updateMixingInstructionButtons();
}

// 指示ボタンのクリックイベント設定
function setupInstructionButtonEvents() {
    // 既存のイベントリスナーを削除（イベント委譲を使用）
    const tbody = document.getElementById('mixing-order-tbody');
    if (tbody) {
        // 既存のイベントリスナーを削除
        tbody.removeEventListener('click', handleInstructionButtonClickEvent);
        // 新しいイベントリスナーを設定（イベント委譲）
        tbody.addEventListener('click', handleInstructionButtonClickEvent);
    }
}

// 栃木工場用：行クリックイベント設定
function setupMixingOrderRowClickEvents() {
    const tbody = document.getElementById('mixing-order-tbody');
    if (tbody) {
        // 既存のイベントリスナーを削除
        tbody.removeEventListener('click', handleMixingOrderRowClickEvent);
        // 新しいイベントリスナーを設定（イベント委譲）
        tbody.addEventListener('click', handleMixingOrderRowClickEvent);
    }
}

// 栃木工場用：イベント委譲による指示ボタンクリック処理
function handleInstructionButtonClickEvent(event) {
    const btn = event.target;
    if (btn.classList.contains('instruction-btn')) {
        const index = parseInt(btn.getAttribute('data-index'));
        handleInstructionButtonClick(index, 'tochigi');
    }
}

// 栃木工場用：行クリック処理
function handleMixingOrderRowClickEvent(event) {
    const row = event.target.closest('tr');
    if (row && !event.target.classList.contains('instruction-btn')) {
        handleMixingOrderRowClick(row);
    }
}

// 栃木工場用：行クリック処理の実装
function handleMixingOrderRowClick(row) {
    // 既に選択されている場合は選択解除
    if (row.classList.contains('selected')) {
        // 選択解除時は指示エリアもクリア
        clearMixingInstructionArea();
        return;
    }
    
    // 茨城工場のすべてのセルの選択状態をクリア
    const allIbarakiCells = document.querySelectorAll('#batch-schedule-tbody td');
    allIbarakiCells.forEach(cell => {
        cell.classList.remove('selected');
    });
    
    // 栃木工場のすべての行の選択状態をクリア
    const allTochigiRows = document.querySelectorAll('#mixing-order-tbody tr');
    allTochigiRows.forEach(r => {
        r.classList.remove('selected');
    });
    
    // 行クリック時は選択状態のみ変更（指示エリアは更新しない）
    row.classList.add('selected');
    
    // 行のデータを取得してcurrentSelectedDataを設定
    const rowData = extractRowData(row);
    if (rowData) {
        // 行のインデックスを取得
        const rows = document.querySelectorAll('#mixing-order-tbody tr');
        const rowIndex = Array.from(rows).indexOf(row);
        
        // currentSelectedDataを設定
        window.currentSelectedData = {
            factory: 'tochigi',
            index: rowIndex,
            data: rowData
        };
    }
    
    // 背景緑のデータが選択された場合、ボタンを有効化
    updateMixingInstructionButtons();
}

// 指示ボタンクリック処理
function handleInstructionButtonClick(index, factory) {
    // クリックされた指示ボタンを取得
    const clickedBtn = document.querySelector(`.instruction-btn[data-index="${index}"]`);
    if (!clickedBtn) return;
    
    // 既に選択されている場合は選択解除
    if (clickedBtn.classList.contains('instruction-selected')) {
        clickedBtn.classList.remove('instruction-selected');
        // 指示エリアをクリア
        clearMixingInstructionArea();
        return;
    }
    
    // 既存の指示ボタンの選択状態をクリア
    const allInstructionBtns = document.querySelectorAll('.instruction-btn');
    allInstructionBtns.forEach(btn => {
        btn.classList.remove('instruction-selected');
    });
    
    // クリックされた指示ボタンに選択状態を追加
    clickedBtn.classList.add('instruction-selected');
    
    let data = null;
    
    if (factory === 'tochigi') {
        // テーブルから直接データを取得
        const rows = document.querySelectorAll('#mixing-order-tbody tr');
        if (rows[index]) {
            data = extractRowData(rows[index]);
            // extractRowDataはvolumeを返すが、updateMixingInstructionAreaもvolumeを期待しているのでそのまま使用
        }
    } else if (factory === 'ibaraki') {
        // 茨城工場のデータ（後で実装）
        data = ibarakiData.mixingOrderData[index];
    }
    
    if (data) {
        // 指示ボタンクリック時は指示エリアのみ更新（行の選択状態は変更しない）
        updateMixingInstructionArea(data, factory, index);
    }
}

// 練混指示テーブルに値が表示されているかチェック
function hasMixingInstructionValues() {
    const batchNo = document.getElementById('instruction-batch-no').textContent.trim();
    const line = document.getElementById('instruction-line').textContent.trim();
    const project = document.getElementById('instruction-project').textContent.trim();
    const strength = document.getElementById('instruction-strength').textContent.trim();
    
    // 主要な値がすべて「-」でない場合は値が表示されている
    return batchNo !== '-' && line !== '-' && project !== '-' && strength !== '-';
}

// 練り指示確定ボタンの有効/無効を更新
function updateConfirmMixingInstructionButton() {
    const confirmMixingInstructionBtn = document.getElementById('confirm-mixing-instruction-btn');
    if (confirmMixingInstructionBtn) {
        const hasValues = hasMixingInstructionValues();
        confirmMixingInstructionBtn.disabled = !hasValues;
    }
}

// 練混指示エリアの更新
function updateMixingInstructionArea(data, factory, index) {
    // 累計バッチNo（バッチNoの-の後ろの数字）
    const batchNoParts = data.batchNo.split('-');
    const cumulativeBatchNo = batchNoParts.length > 1 ? batchNoParts[1] : data.batchNo;
    
    // 強度 数量（単位付き）
    // data.volumeまたはdata.m3のどちらかを使用（互換性のため）
    const volumeValue = parseFloat(data.volume || data.m3 || 0).toFixed(2);
    const strengthQuantity = `${data.strength} ${volumeValue}㎥`;
    
    // 練混指示エリアの要素を更新
    document.getElementById('instruction-batch-no').textContent = cumulativeBatchNo;
    
    // 茨城工場の場合はライン名の先頭に「茨城_」を付ける
    let displayLine = data.line;
    if (factory === 'ibaraki') {
        displayLine = `茨城_${data.line}`;
    }
    document.getElementById('instruction-line').textContent = displayLine;
    
    document.getElementById('instruction-project').textContent = data.project;
    document.getElementById('instruction-strength').textContent = strengthQuantity;
    
    // 調合NoとミキサーNoは入力欄なので、プレースホルダーを設定
    const mixNoInput = document.getElementById('instruction-mix-no');
    mixNoInput.placeholder = '調合No';
    mixNoInput.value = ''; // 一旦クリア
    
    // 注文データから調合Noを取得して設定
    let mixNo = '';
    try {
        // 工場タイプを取得
        const factorySelect = document.querySelector('.factory-selector');
        const factoryValue = factorySelect ? factorySelect.value : (factory === 'ibaraki' ? 'ibaraki-factory' : 'tochigi-factory');
        
        // バッチNoから注文Noを抽出（例：'1-1' → '1'）
        const orderNo = batchNoParts.length > 1 ? batchNoParts[0] : '';
        
        if (orderNo && typeof orderData !== 'undefined' && orderData[factoryValue]) {
            const factoryData = orderData[factoryValue];
            
            // ライン名を取得（茨城工場の場合はそのまま使用、栃木工場の場合は'栃木_'を付ける）
            let searchLine = data.line;
            if (factory === 'tochigi' && !searchLine.startsWith('栃木_')) {
                searchLine = `栃木_${searchLine}`;
            }
            
            // 該当する注文を検索
            let targetOrder = null;
            
            // まず、指定されたラインで検索
            if (factoryData[searchLine]) {
                targetOrder = factoryData[searchLine].find(o => 
                    o.orderNo === orderNo && o.project === data.project
                );
            }
            
            // 見つからない場合、すべてのラインを検索
            if (!targetOrder) {
                for (const lineKey in factoryData) {
                    const lineData = factoryData[lineKey];
                    if (Array.isArray(lineData)) {
                        targetOrder = lineData.find(o => 
                            o.orderNo === orderNo && o.project === data.project
                        );
                        if (targetOrder) {
                            break;
                        }
                    }
                }
            }
            
            // 調合Noを取得
            if (targetOrder && targetOrder.mixNo && targetOrder.mixNo.trim() !== '') {
                mixNo = targetOrder.mixNo.trim();
            }
        }
    } catch (error) {
        console.error('調合Noの取得でエラーが発生しました:', error);
    }
    
    // 調合Noに値がある場合は設定、ない場合は空のまま
    if (mixNo) {
        mixNoInput.value = mixNo;
    }
    
    document.getElementById('instruction-mixer-no').value = '';
    
    // 標準期（仮の値）
    document.getElementById('standard-period-value').textContent = '66666';
    
    // 練り指示確定ボタンの有効/無効を更新
    updateConfirmMixingInstructionButton();
    
    // 練り指示確定ボタンの表示状態を設定
    const confirmMixingInstructionBtn = document.getElementById('confirm-mixing-instruction-btn');
    const confirmMixingBtn = document.getElementById('confirm-mixing-btn');
    if (confirmMixingInstructionBtn) {
        confirmMixingInstructionBtn.style.display = '';
    }
    if (confirmMixingBtn) {
        confirmMixingBtn.style.display = 'none';
    }
    
    // 現在選択中のデータを保存
    window.currentSelectedData = {
        factory: factory,
        index: index,
        data: data
    };
}

// 行の選択状態を更新
function updateRowSelection(factory, index) {
    if (factory === 'tochigi') {
        const rows = document.querySelectorAll('#mixing-order-tbody tr');
        if (rows[index]) {
            rows[index].classList.add('selected');
        }
    } else if (factory === 'ibaraki') {
        // 茨城工場の場合は直接セルを指定
        if (index && index.classList) {
            index.classList.add('selected');
        }
    }
}

// 行の選択状態をクリア
function clearRowSelection() {
    // 栃木工場の選択状態をクリア
    const tochigiRows = document.querySelectorAll('#mixing-order-tbody tr.selected');
    tochigiRows.forEach(row => row.classList.remove('selected'));
    
    // 茨城工場のセルの選択状態をクリア
    const ibarakiCells = document.querySelectorAll('#batch-schedule-tbody td.selected');
    ibarakiCells.forEach(cell => cell.classList.remove('selected'));
    
    // 茨城工場の行全体の選択状態もクリア（念のため）
    const ibarakiRows = document.querySelectorAll('#batch-schedule-tbody tr.selected');
    ibarakiRows.forEach(row => row.classList.remove('selected'));
}

// 練混指示エリアをクリア
function clearMixingInstructionArea() {
    document.getElementById('instruction-batch-no').textContent = '-';
    document.getElementById('instruction-line').textContent = '-';
    document.getElementById('instruction-project').textContent = '-';
    document.getElementById('instruction-strength').textContent = '-';
    document.getElementById('instruction-mix-no').value = '';
    document.getElementById('instruction-mix-no').placeholder = '調合No';
    document.getElementById('instruction-mixer-no').value = '';
    document.getElementById('standard-period-value').textContent = '-';
    
    // 練り指示確定ボタンの有効/無効を更新
    updateConfirmMixingInstructionButton();
    
    // ボタンの表示状態をリセット
    const confirmMixingInstructionBtn = document.getElementById('confirm-mixing-instruction-btn');
    const confirmMixingBtn = document.getElementById('confirm-mixing-btn');
    if (confirmMixingInstructionBtn) {
        confirmMixingInstructionBtn.style.display = '';
    }
    if (confirmMixingBtn) {
        confirmMixingBtn.disabled = true;
        confirmMixingBtn.style.display = 'none';
    }
    
    // 選択状態をクリア
    clearRowSelection();
    
    // 現在選択中のデータをクリア
    window.currentSelectedData = null;
    
    // ボタンを無効化
    updateMixingInstructionButtons();
}

// 練り指示ボタンの有効化/無効化処理
function updateMixingInstructionButtons() {
    const changeBtn = document.getElementById('change-mixing-instruction-btn');
    const deleteBtn = document.getElementById('delete-mixing-instruction-btn');
    const changeAfterBtn = document.getElementById('change-after-mixing-btn');
    
    // 工場を判定
    const factorySelector = document.querySelector('.factory-selector');
    const factoryValue = factorySelector ? factorySelector.value : 'tochigi-factory';
    
    // 選択されたデータがあるかチェック
    let hasSelectedData = false;
    // 練り上がったバッチ割が選択されているかチェック（練り上がり後変更ボタン用）
    let hasCompletedSelectedData = false;
    
    if (factoryValue === 'tochigi-factory') {
        // 栃木工場の場合：mixing-order-tbodyのtrがselectedのデータがあるかチェック
        const selectedRows = document.querySelectorAll('#mixing-order-tbody tr.selected');
        hasSelectedData = selectedRows.length > 0;
        
        // 練り上がったバッチ割が選択されているかチェック（completedクラスがある行）
        if (hasSelectedData) {
            const selectedRow = selectedRows[0];
            hasCompletedSelectedData = selectedRow.classList.contains('completed');
        }
    } else if (factoryValue === 'ibaraki-factory') {
        // 茨城工場の場合：batch-schedule-tbodyのclickable-cellがselectedのデータがあるかチェック
        const selectedCells = document.querySelectorAll('#batch-schedule-tbody .clickable-cell.selected');
        hasSelectedData = selectedCells.length > 0;
        
        // 練り上がったバッチ割が選択されているかチェック（data-is-completedが'true'またはcompletedクラスがあるセル）
        if (hasSelectedData) {
            const selectedCell = selectedCells[0];
            hasCompletedSelectedData = selectedCell.getAttribute('data-is-completed') === 'true' || 
                                       selectedCell.classList.contains('completed');
        }
    }
    
    // ボタンの有効/無効を設定
    // 練り指示変更ボタンは、選択されたデータがあれば有効（完了済でも有効）
    if (changeBtn) changeBtn.disabled = !hasSelectedData;
    // 練り上がったバッチ割が選択されている場合は、削除ボタンは無効
    if (deleteBtn) deleteBtn.disabled = !hasSelectedData || hasCompletedSelectedData;
    // 練り上がり後変更ボタンは、練り上がったバッチ割が選択されている場合のみ有効
    if (changeAfterBtn) changeAfterBtn.disabled = !hasCompletedSelectedData;
}

// 練り指示確定ボタンのイベント設定
function setupConfirmMixingButton() {
    // 練り指示確定ボタンのイベント設定
    const confirmMixingInstructionBtn = document.getElementById('confirm-mixing-instruction-btn');
    if (confirmMixingInstructionBtn) {
        confirmMixingInstructionBtn.addEventListener('click', handleConfirmMixingInstructionClick);
    } else {
        console.error('練り指示確定ボタンが見つかりません');
    }
    
    // 練り上がりボタンのイベント設定
    const confirmMixingBtn = document.getElementById('confirm-mixing-btn');
    if (confirmMixingBtn) {
        confirmMixingBtn.addEventListener('click', handleConfirmMixingClick);
    } else {
        console.error('練り上がりボタンが見つかりません');
    }
}

// 練り指示確定ボタンクリック処理
function handleConfirmMixingInstructionClick() {
    console.log('練り指示確定ボタンがクリックされました');
    
    // 強度が空欄の場合は押せない
    const strengthValue = document.getElementById('instruction-strength').textContent;
    console.log('強度の値:', strengthValue);
    
    if (!strengthValue || strengthValue === '-') {
        alert('強度が設定されていません。');
        return;
    }
    
    // 練り指示確定ボタンを非表示にし、練り上がりボタンを表示
    const confirmMixingInstructionBtn = document.getElementById('confirm-mixing-instruction-btn');
    const confirmMixingBtn = document.getElementById('confirm-mixing-btn');
    
    if (confirmMixingInstructionBtn) {
        confirmMixingInstructionBtn.style.display = 'none';
    }
    if (confirmMixingBtn) {
        confirmMixingBtn.style.display = '';
        confirmMixingBtn.disabled = false;
    }
}

// 練り上がりボタンクリック処理
function handleConfirmMixingClick() {
    console.log('練り上がりボタンがクリックされました');
    
    // 強度が空欄の場合は押せない
    const strengthValue = document.getElementById('instruction-strength').textContent;
    console.log('強度の値:', strengthValue);
    
    if (!strengthValue || strengthValue === '-') {
        alert('強度が設定されていません。');
        return;
    }
    
    // 練り上がり確認モーダルを表示
    showMixingCompletionModal();
}

// 練り上がり確認モーダルを表示
function showMixingCompletionModal() {
    if (!window.currentSelectedData) {
        console.error('選択中のデータがありません。');
        return;
    }
    
    const { data } = window.currentSelectedData;
    
    // 今日の日付を設定
    const today = new Date();
    const todayFormatted = `${today.getFullYear()}/${String(today.getMonth() + 1).padStart(2, '0')}/${String(today.getDate()).padStart(2, '0')}`;
    
    // 型枠番号を取得（練り混ぜ順エリアのデータから）
    const formworkNo = getFormworkNumberFromSelectedData();
    
    // モーダルの内容を設定
    document.getElementById('mixing-completion-modal-date').textContent = todayFormatted;
    document.getElementById('mixing-completion-modal-line').textContent = data.line;
    document.getElementById('mixing-completion-modal-formwork').textContent = formworkNo;
    document.getElementById('mixing-completion-modal-project').textContent = data.project;
    document.getElementById('mixing-completion-modal-strength').textContent = data.strength;
    // data.volumeまたはdata.m3のどちらかを使用（互換性のため）
    const volumeForModal = data.volume || data.m3 || '0';
    document.getElementById('mixing-completion-modal-concrete').textContent = `${volumeForModal}㎥`;
    
    // 練混指示エリアの調合NoとミキサーNoを取得
    const mixNo = document.getElementById('instruction-mix-no').value;
    const mixerNo = document.getElementById('instruction-mixer-no').value;
    
    document.getElementById('mixing-completion-modal-mix-no').textContent = mixNo || '-';
    document.getElementById('mixing-completion-modal-mixer-no').textContent = mixerNo || '-';
    
    // モーダルを表示
    document.getElementById('mixing-completion-modal').style.display = 'flex';
    
    // モーダルのイベント設定
    setupMixingCompletionModalEvents();
}

// 選択中のデータから型枠番号を取得
function getFormworkNumberFromSelectedData() {
    if (!window.currentSelectedData) {
        return 'No.02'; // デフォルト値
    }
    
    const { data } = window.currentSelectedData;
    
    // 練り混ぜ順エリアのデータから型枠番号を取得
    // 現在の実装では型枠番号の情報がないため、デフォルト値を返す
    // 必要に応じて、データ構造を拡張して型枠番号を含める
    return data.formwork || 'No.02';
}

// 練り上がり確認モーダルのイベント設定
function setupMixingCompletionModalEvents() {
    const modal = document.getElementById('mixing-completion-modal');
    const cancelBtn = document.getElementById('mixing-completion-modal-cancel');
    const confirmBtn = document.getElementById('mixing-completion-modal-confirm');
    
    // 既存のイベントリスナーを削除
    if (cancelBtn) {
        cancelBtn.removeEventListener('click', handleMixingCompletionModalCancel);
        cancelBtn.addEventListener('click', handleMixingCompletionModalCancel);
    }
    
    if (confirmBtn) {
        confirmBtn.removeEventListener('click', handleMixingCompletionModalConfirm);
        confirmBtn.addEventListener('click', handleMixingCompletionModalConfirm);
    }
    
    // モーダル外クリックで閉じる
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            handleMixingCompletionModalCancel();
        }
    });
}

// 練り上がり確認モーダルキャンセル処理
function handleMixingCompletionModalCancel() {
    document.getElementById('mixing-completion-modal').style.display = 'none';
}

// 練り上がり確認モーダル確定処理
function handleMixingCompletionModalConfirm() {
    // 練り指示確定処理を実行
    processMixingInstructionConfirmation();
    
    // モーダルを閉じる
    document.getElementById('mixing-completion-modal').style.display = 'none';
}

// 練り指示確定処理
function processMixingInstructionConfirmation() {
    if (!window.currentSelectedData) {
        console.error('選択中のデータがありません。');
        return;
    }
    
    const { factory, index, data } = window.currentSelectedData;
    
    // 打設量エリアの対象の練り量に数量を+する
    // data.volumeまたはdata.m3のどちらかを使用（互換性のため）
    const volumeForUpdate = data.volume || data.m3 || '0';
    updatePouringVolume(volumeForUpdate);
    
    // 練り混ぜ順エリアの選択しているデータを指示済とし、背景を灰色にする
    markAsCompleted(factory, index);
    
    // 練混指示エリアをクリア
    clearMixingInstructionArea();
    
    console.log('練り指示が確定されました。');
}

// 打設量エリアの更新
function updatePouringVolume(volume) {
    // 現在の練り量を取得
    const currentMixingVolume = document.getElementById('total-mixing-volume');
    if (currentMixingVolume) {
        const currentValue = parseFloat(currentMixingVolume.textContent) || 0;
        const newValue = currentValue + parseFloat(volume);
        currentMixingVolume.textContent = newValue.toFixed(2);
    }
    
    // 各ラインの練り量も更新（該当するラインを探して更新）
    const pouringVolumeRows = document.querySelectorAll('#pouring-volume-tbody tr');
    pouringVolumeRows.forEach(row => {
        const lineNameCell = row.querySelector('.line-name-cell');
        if (lineNameCell && window.currentSelectedData) {
            const selectedLine = window.currentSelectedData.data.line;
            if (lineNameCell.textContent === selectedLine) {
                const mixingVolumeCell = row.querySelector('.mixing-volume-cell');
                if (mixingVolumeCell) {
                    const currentValue = parseFloat(mixingVolumeCell.textContent) || 0;
                    const newValue = currentValue + parseFloat(volume);
                    mixingVolumeCell.textContent = newValue.toFixed(2);
                }
            }
        }
    });
}

// 指示済み状態の管理
function markAsCompleted(factory, index) {
    if (factory === 'tochigi') {
        // 栃木工場の場合：練り混ぜ順テーブルの行を指示済みにする
        const rows = document.querySelectorAll('#mixing-order-tbody tr');
        if (rows[index]) {
            rows[index].classList.add('completed');
            rows[index].style.backgroundColor = '#cccccc';
            
            // 指示ボタンを無効化
            const instructionBtn = rows[index].querySelector('.instruction-btn');
            if (instructionBtn) {
                // instruction-selectedクラスを解除
                instructionBtn.classList.remove('instruction-selected');
                instructionBtn.disabled = true;
                instructionBtn.textContent = '完了';
                instructionBtn.style.color = '#666666';
            }
        }
    } else if (factory === 'ibaraki') {
        // 茨城工場の場合：バッチ割付・練混予定テーブルのセルを指示済みにする
        // データからbatchNoを取得して、該当するセルを特定
        const data = window.currentSelectedData?.data;
        if (data && data.batchNo) {
            const targetCell = document.querySelector(`#batch-schedule-tbody .clickable-cell[data-batch-no="${data.batchNo}"]`);
            if (targetCell) {
                targetCell.classList.add('completed');
                targetCell.style.backgroundColor = '#cccccc';
                targetCell.style.cursor = 'not-allowed';
                console.log('茨城工場のセルを指示済みにしました:', data.batchNo);
            } else {
                console.error('茨城工場の対象セルが見つかりません:', data.batchNo);
            }
        }
    }
}

// 栃木工場用：行のデータを抽出する関数
function extractRowData(row) {
    const cells = row.querySelectorAll('td');
    if (cells.length < 6) {
        console.error('行のセル数が不足しています:', cells.length);
        return null;
    }
    
    const batchNo = cells[2].textContent.trim();
    const line = cells[0].textContent.trim();
    const changeRequestVolume = row.getAttribute('data-change-request-volume') ? parseFloat(row.getAttribute('data-change-request-volume')) : null;
    
    return {
        line: line,
        project: cells[1].textContent.trim(),
        batchNo: batchNo,
        strength: cells[3].textContent.trim(),
        volume: cells[4].textContent.trim(),
        time: cells[5].textContent.trim(),
        changeRequestVolume: changeRequestVolume
    };
}

// 練り指示変更ボタンクリック処理
function handleChangeMixingInstructionClick() {
    if (!window.currentSelectedData) {
        console.error('選択中のデータがありません。');
        return;
    }
    
    const { data, factory } = window.currentSelectedData;
    
    // 今日の日付を設定
    const today = new Date();
    const todayFormatted = `${today.getFullYear()}/${String(today.getMonth() + 1).padStart(2, '0')}/${String(today.getDate()).padStart(2, '0')}`;
    
    // 変更依頼数量を取得（dataオブジェクトに含まれている場合はそれを使用、なければ関数で取得）
    const factoryValue = factory === 'ibaraki' ? 'ibaraki-factory' : 'tochigi-factory';
    const changeRequestVolume = data.changeRequestVolume !== undefined ? data.changeRequestVolume : getChangeRequestVolume(factoryValue, data.line, data.batchNo);
    const hasChangeRequest = changeRequestVolume !== null && changeRequestVolume !== undefined;
    
    // モーダルの内容を設定
    document.getElementById('change-modal-date').textContent = todayFormatted;
    document.getElementById('change-modal-line').textContent = data.line;
    document.getElementById('change-modal-formwork').textContent = 'No.02'; // 型枠番号をNo.02で統一
    document.getElementById('change-modal-strength').textContent = data.strength;
    // data.volumeまたはdata.m3のどちらかを使用（互換性のため）
    const volumeForChange = data.volume || data.m3 || '0';
    document.getElementById('change-modal-concrete-original').textContent = volumeForChange;
    
    // 変更依頼がある場合は変更依頼数量をデフォルト値に設定、ない場合は元の数量を設定
    if (hasChangeRequest) {
        document.getElementById('change-modal-concrete-input').value = changeRequestVolume.toFixed(2);
        // 変更依頼行を表示
        document.getElementById('change-modal-change-request-row').style.display = 'flex';
        document.getElementById('change-modal-change-request-volume').textContent = changeRequestVolume.toFixed(2);
    } else {
        document.getElementById('change-modal-concrete-input').value = volumeForChange;
        // 変更依頼行を非表示
        document.getElementById('change-modal-change-request-row').style.display = 'none';
    }
    
    // モーダルを表示
    document.getElementById('change-mixing-instruction-modal').style.display = 'flex';
    
    // モーダルのイベント設定
    setupChangeMixingInstructionModalEvents();
}

// 練り指示削除ボタンクリック処理
function handleDeleteMixingInstructionClick() {
    if (!window.currentSelectedData) {
        console.error('選択中のデータがありません。');
        return;
    }
    
    const { data } = window.currentSelectedData;
    
    // 今日の日付を設定
    const today = new Date();
    const todayFormatted = `${today.getFullYear()}/${String(today.getMonth() + 1).padStart(2, '0')}/${String(today.getDate()).padStart(2, '0')}`;
    
    // モーダルの内容を設定
    document.getElementById('delete-mixing-modal-date').textContent = todayFormatted;
    document.getElementById('delete-mixing-modal-line').textContent = data.line;
    document.getElementById('delete-mixing-modal-formwork').textContent = 'No.02'; // 型枠番号をNo.02で統一
    document.getElementById('delete-mixing-modal-strength').textContent = data.strength;
    // data.volumeまたはdata.m3のどちらかを使用（互換性のため）
    const volumeForDelete = data.volume || data.m3 || '0';
    document.getElementById('delete-mixing-modal-concrete').textContent = `${volumeForDelete}㎥`;
    
    // モーダルを表示
    document.getElementById('delete-mixing-instruction-modal').style.display = 'flex';
    
    // モーダルのイベント設定
    setupDeleteMixingInstructionModalEvents();
}

// 練り上がり後変更ボタンクリック処理
function handleChangeAfterMixingClick() {
    if (!window.currentSelectedData) {
        console.error('選択中のデータがありません。');
        return;
    }
    
    const { data } = window.currentSelectedData;
    
    // 今日の日付を設定
    const today = new Date();
    const todayFormatted = `${today.getFullYear()}/${String(today.getMonth() + 1).padStart(2, '0')}/${String(today.getDate()).padStart(2, '0')}`;
    
    // モーダルの内容を設定
    document.getElementById('change-after-modal-date').textContent = todayFormatted;
    document.getElementById('change-after-modal-strength').textContent = data.strength;
    // data.volumeまたはdata.m3のどちらかを使用（互換性のため）
    const volumeForChangeAfter = data.volume || data.m3 || '0';
    document.getElementById('change-after-modal-concrete').textContent = volumeForChangeAfter;
    document.getElementById('change-after-modal-batch-no').textContent = data.batchNo;
    
    // 現在のラインと型枠番号を左側に表示
    document.getElementById('change-after-modal-current-line').textContent = data.line;
    const formworkValue = data.formwork || 'No.02';
    document.getElementById('change-after-modal-current-formwork').textContent = formworkValue;
    
    // ライン選択肢を設定
    setupChangeAfterModalLineOptions();
    
    // プルダウンは空欄にする
    const lineSelect = document.getElementById('change-after-modal-line');
    if (lineSelect) {
        lineSelect.value = '';
    }
    
    const formworkSelect = document.getElementById('change-after-modal-formwork');
    if (formworkSelect) {
        formworkSelect.value = '';
    }
    
    // 変更先項目を初期化
    updateChangeAfterModalDestinationFields();
    
    // モーダルを表示
    document.getElementById('change-after-mixing-modal').style.display = 'flex';
    
    // モーダルのイベント設定
    setupChangeAfterMixingModalEvents();
}

// 練り上がり後変更モーダルのライン選択肢を設定
function setupChangeAfterModalLineOptions() {
    const lineSelect = document.getElementById('change-after-modal-line');
    if (!lineSelect) return;
    
    // 既存のoptionをクリア
    lineSelect.innerHTML = '<option value="">選択してください</option>';
    
    // 工場に応じてライン選択肢を設定
    const factorySelector = document.querySelector('.factory-selector');
    const factoryValue = factorySelector ? factorySelector.value : 'tochigi-factory';
    
    let options = [];
    
    if (factoryValue === 'tochigi-factory') {
        // 栃木工場のライン（3つ程度）
        options = [
            { value: '栃木_建築A北', text: '栃木_建築A北' },
            { value: '栃木_建築B北', text: '栃木_建築B北' },
            { value: '栃木_南工場', text: '栃木_南工場' }
        ];
    } else if (factoryValue === 'ibaraki-factory') {
        // 茨城工場のライン（3つ程度）
        options = [
            { value: '茨城_Aライン', text: '茨城_Aライン' },
            { value: '茨城_B1ライン', text: '茨城_B1ライン' },
            { value: '茨城_C1ライン', text: '茨城_C1ライン' }
        ];
    }
    
    // 新しいoptionを追加
    options.forEach(option => {
        const optionElement = document.createElement('option');
        optionElement.value = option.value;
        optionElement.textContent = option.text;
        lineSelect.appendChild(optionElement);
    });
}

// 練り上がり後変更モーダルのイベント設定
function setupChangeAfterMixingModalEvents() {
    const modal = document.getElementById('change-after-mixing-modal');
    const cancelBtn = document.getElementById('change-after-modal-cancel');
    const confirmBtn = document.getElementById('change-after-modal-confirm');
    const lineSelect = document.getElementById('change-after-modal-line');
    const formworkSelect = document.getElementById('change-after-modal-formwork');
    
    // 既存のイベントリスナーを削除
    if (cancelBtn) {
        cancelBtn.removeEventListener('click', handleChangeAfterModalCancel);
        cancelBtn.addEventListener('click', handleChangeAfterModalCancel);
    }
    
    if (confirmBtn) {
        confirmBtn.removeEventListener('click', handleChangeAfterModalConfirm);
        confirmBtn.addEventListener('click', handleChangeAfterModalConfirm);
    }
    
    // ラインと型枠番号の選択変更イベント
    if (lineSelect) {
        lineSelect.removeEventListener('change', updateChangeAfterModalDestinationFields);
        lineSelect.addEventListener('change', updateChangeAfterModalDestinationFields);
    }
    
    if (formworkSelect) {
        formworkSelect.removeEventListener('change', updateChangeAfterModalDestinationFields);
        formworkSelect.addEventListener('change', updateChangeAfterModalDestinationFields);
    }
    
    // モーダル外クリックで閉じる
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            handleChangeAfterModalCancel();
        }
    });
}

// 練り上がり後変更モーダルの変更先項目を更新
function updateChangeAfterModalDestinationFields() {
    const lineSelect = document.getElementById('change-after-modal-line');
    const formworkSelect = document.getElementById('change-after-modal-formwork');
    const destinationProjectElement = document.getElementById('change-after-modal-destination-project');
    const destinationStrengthElement = document.getElementById('change-after-modal-destination-strength');
    
    if (!lineSelect || !formworkSelect || !destinationProjectElement || !destinationStrengthElement) {
        return;
    }
    
    const selectedLine = lineSelect.value;
    const selectedFormwork = formworkSelect.value;
    
    // ラインと型枠番号の両方が選択されている場合のみ値を表示
    if (selectedLine && selectedFormwork) {
        // 型枠番号に応じて変更先物件略称を設定
        const formworkToProjectMap = {
            'No.01': '〇〇駅西口開発',
            'No.02': '〇〇丁目工事',
            'No.03': '〇〇ビル新築工事'
        };
        
        const destinationProject = formworkToProjectMap[selectedFormwork] || '-';
        destinationProjectElement.textContent = destinationProject;
        
        // 変更先強度は現在のデータの強度を表示
        if (window.currentSelectedData && window.currentSelectedData.data) {
            const currentStrength = window.currentSelectedData.data.strength || '-';
            destinationStrengthElement.textContent = currentStrength;
        } else {
            destinationStrengthElement.textContent = '-';
        }
    } else {
        // どちらか一方でも未選択の場合は「-」を表示
        destinationProjectElement.textContent = '-';
        destinationStrengthElement.textContent = '-';
    }
}

// 練り上がり後変更モーダルキャンセル処理
function handleChangeAfterModalCancel() {
    document.getElementById('change-after-mixing-modal').style.display = 'none';
}

// 練り上がり後変更モーダル確認処理
function handleChangeAfterModalConfirm() {
    const newLine = document.getElementById('change-after-modal-line').value;
    const newFormwork = document.getElementById('change-after-modal-formwork').value;
    
    if (!newLine) {
        alert('ラインを選択してください。');
        return;
    }
    
    if (!newFormwork) {
        alert('型枠番号を選択してください。');
        return;
    }
    
    if (!window.currentSelectedData) {
        console.error('選択中のデータがありません。');
        return;
    }
    
    const { factory, index, data } = window.currentSelectedData;
    
    // 練り混ぜ順エリアのラインと型枠番号を更新
    updateMixingOrderLineAndFormwork(factory, index, newLine, newFormwork);
    
    // 茨城工場の場合は、データを新しいライン列に移動
    if (factory === 'ibaraki') {
        moveDataToNewLine(data, newLine);
    }
    
    // 選択状態を解除
    clearMixingInstructionArea();
    
    // モーダルを閉じる
    document.getElementById('change-after-mixing-modal').style.display = 'none';
    
    console.log('練り上がり後変更を実行しました:', { newLine, newFormwork });
}

// 練り混ぜ順エリアのラインと型枠番号を更新
function updateMixingOrderLineAndFormwork(factory, index, newLine, newFormwork) {
    if (factory === 'tochigi') {
        // 栃木工場の場合：練り混ぜ順テーブルの行を更新
        const rows = document.querySelectorAll('#mixing-order-tbody tr');
        if (rows[index]) {
            const lineCell = rows[index].querySelector('td:nth-child(1)'); // ライン列
            if (lineCell) {
                lineCell.textContent = newLine;
            }
            // バッチNoは変更しない（型枠番号は入れない）
        }
    } else if (factory === 'ibaraki') {
        // 茨城工場の場合：バッチ割付・練混予定テーブルのセルを更新
        const data = window.currentSelectedData?.data;
        if (data && data.batchNo) {
            const targetCell = document.querySelector(`#batch-schedule-tbody .clickable-cell[data-batch-no="${data.batchNo}"]`);
            if (targetCell) {
                targetCell.setAttribute('data-line', newLine);
                // 型枠番号の情報も保存（必要に応じて）
                targetCell.setAttribute('data-formwork', newFormwork);
            }
        }
    }
}

// 茨城工場でデータを新しいライン列に移動
function moveDataToNewLine(data, newLine) {
    if (!data || !data.batchNo) return;
    
    // 現在のセルを取得
    const currentCell = document.querySelector(`#batch-schedule-tbody .clickable-cell[data-batch-no="${data.batchNo}"]`);
    if (!currentCell) return;
    
    // 現在のセルの列インデックスを取得
    const currentColumnIndex = Array.from(currentCell.parentNode.children).indexOf(currentCell);
    
    // 新しいラインに対応する列インデックスを取得
    const newColumnIndex = getLineColumnIndex(newLine);
    if (newColumnIndex === -1) return;
    
    // 同じ列の場合は何もしない
    if (currentColumnIndex === newColumnIndex) return;
    
    // 現在のセルのデータを保存
    const cellData = {
        text: currentCell.textContent,
        batchNo: currentCell.getAttribute('data-batch-no'),
        strength: currentCell.getAttribute('data-strength'),
        volume: currentCell.getAttribute('data-volume'),
        line: newLine,
        project: currentCell.getAttribute('data-project'),
        isCompleted: currentCell.getAttribute('data-is-completed'),
        formwork: currentCell.getAttribute('data-formwork') || 'No.02'
    };
    
    // 現在のセルを空にする
    clearCell(currentCell);
    
    // 新しい列の最初の空のセルを見つける
    const allRows = document.querySelectorAll('#batch-schedule-tbody tr');
    let targetRowIndex = -1;
    
    for (let i = 1; i < allRows.length; i++) { // 1行目は強度行なのでスキップ
        const row = allRows[i];
        const targetCell = row.children[newColumnIndex];
        
        if (!targetCell.classList.contains('clickable-cell') || targetCell.textContent.trim() === '') {
            targetRowIndex = i;
            break;
        }
    }
    
    if (targetRowIndex === -1) {
        console.error('新しいライン列に空きがありません');
        return;
    }
    
    // 新しいセルにデータを設定
    const targetRow = allRows[targetRowIndex];
    const newCell = targetRow.children[newColumnIndex];
    
    newCell.textContent = cellData.text;
    newCell.className = 'clickable-cell';
    // 既存のCSSスタイルを維持するため、borderとbackgroundの設定を削除
    
    // データ属性を設定
    newCell.setAttribute('data-batch-no', cellData.batchNo);
    newCell.setAttribute('data-strength', cellData.strength);
    newCell.setAttribute('data-volume', cellData.volume);
    newCell.setAttribute('data-line', cellData.line);
    newCell.setAttribute('data-project', cellData.project);
    newCell.setAttribute('data-is-completed', cellData.isCompleted);
    newCell.setAttribute('data-formwork', cellData.formwork);
    
    console.log(`データを${newLine}列に移動しました`);
}

// ライン名から列インデックスを取得
function getLineColumnIndex(lineName) {
    const lineMap = {
        '茨城_Aライン': 1,
        '茨城_B1ライン': 2,
        '茨城_B2ライン': 3,
        '茨城_C1ライン': 4,
        '茨城_C2ライン': 5,
        '茨城_Dライン': 6,
        '茨城_その他': 7
    };
    
    return lineMap[lineName] || -1;
}

// セルを空にする
function clearCell(cell) {
    cell.textContent = '';
    cell.className = '';
    cell.style.border = 'none';
    cell.style.background = 'transparent';
    cell.removeAttribute('data-batch-no');
    cell.removeAttribute('data-strength');
    cell.removeAttribute('data-volume');
    cell.removeAttribute('data-line');
    cell.removeAttribute('data-project');
    cell.removeAttribute('data-is-completed');
    cell.removeAttribute('data-formwork');
}

// 練り指示変更モーダルのイベント設定
function setupChangeMixingInstructionModalEvents() {
    const modal = document.getElementById('change-mixing-instruction-modal');
    const cancelBtn = document.getElementById('change-modal-cancel');
    const confirmBtn = document.getElementById('change-modal-confirm');
    
    // 既存のイベントリスナーを削除
    if (cancelBtn) {
        cancelBtn.removeEventListener('click', handleChangeModalCancel);
        cancelBtn.addEventListener('click', handleChangeModalCancel);
    }
    
    if (confirmBtn) {
        confirmBtn.removeEventListener('click', handleChangeModalConfirm);
        confirmBtn.addEventListener('click', handleChangeModalConfirm);
    }
    
    // モーダル外クリックで閉じる
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            handleChangeModalCancel();
        }
    });
}

// 練り指示変更モーダルキャンセル処理
function handleChangeModalCancel() {
    document.getElementById('change-mixing-instruction-modal').style.display = 'none';
    // 変更依頼行を非表示にリセット
    document.getElementById('change-modal-change-request-row').style.display = 'none';
}

// 練り指示変更モーダル確認処理
function handleChangeModalConfirm() {
    const newVolume = document.getElementById('change-modal-concrete-input').value;
    
    if (!newVolume || parseFloat(newVolume) <= 0) {
        alert('有効なコンクリート量を入力してください。');
        return;
    }
    
    if (!window.currentSelectedData) {
        console.error('選択中のデータがありません。');
        return;
    }
    
    const { factory, index, data } = window.currentSelectedData;
    
    // 変更依頼がある場合は変更依頼データを削除
    const factoryValue = factory === 'ibaraki' ? 'ibaraki-factory' : 'tochigi-factory';
    const changeRequestVolume = data.changeRequestVolume !== undefined ? data.changeRequestVolume : getChangeRequestVolume(factoryValue, data.line, data.batchNo);
    if (changeRequestVolume !== null && changeRequestVolume !== undefined) {
        removeChangeRequestData(factoryValue, data.line, data.batchNo);
    }
    
    // 練り混ぜ順エリアの㎥量を更新
    updateMixingOrderVolume(factory, index, newVolume);
    
    // 選択状態を解除
    clearMixingInstructionArea();
    
    // モーダルを閉じる
    document.getElementById('change-mixing-instruction-modal').style.display = 'none';
    // 変更依頼行を非表示にリセット
    document.getElementById('change-modal-change-request-row').style.display = 'none';
    
    console.log('練り指示を変更しました:', newVolume);
}

// 練り混ぜ順エリアの㎥量を更新
function updateMixingOrderVolume(factory, index, newVolume) {
    if (factory === 'tochigi') {
        // 栃木工場の場合：練り混ぜ順テーブルの行を更新
        const rows = document.querySelectorAll('#mixing-order-tbody tr');
        if (rows[index]) {
            const row = rows[index];
            const volumeCell = row.querySelector('td:nth-child(5)'); // m3数列
            if (volumeCell) {
                volumeCell.textContent = parseFloat(newVolume).toFixed(2);
            }
            
            // 変更依頼スタイルを削除
            if (row.classList.contains('change-request')) {
                row.classList.remove('change-request');
                row.removeAttribute('data-change-request');
                row.removeAttribute('data-change-request-volume');
                // スタイルをリセット（通常のスタイルに戻す）
                row.style.backgroundColor = '';
                row.style.color = '';
                // 各セルの文字色もリセット
                const cells = row.querySelectorAll('td');
                cells.forEach(cell => {
                    cell.style.color = '';
                });
            }
        }
    } else if (factory === 'ibaraki') {
        // 茨城工場の場合：バッチ割付・練混予定テーブルのセルを更新
        const data = window.currentSelectedData?.data;
        if (data && data.batchNo) {
            const targetCell = document.querySelector(`#batch-schedule-tbody .clickable-cell[data-batch-no="${data.batchNo}"]`);
            if (targetCell) {
                const formattedVolume = parseFloat(newVolume).toFixed(2);
                targetCell.textContent = formattedVolume;
                targetCell.setAttribute('data-volume', newVolume);
                
                // 変更依頼スタイルを削除
                if (targetCell.classList.contains('change-request')) {
                    targetCell.classList.remove('change-request');
                    targetCell.removeAttribute('data-change-request');
                    targetCell.removeAttribute('data-change-request-volume');
                    // スタイルをリセット（通常のスタイルに戻す）
                    targetCell.style.backgroundColor = '';
                    targetCell.style.color = '';
                }
            }
        }
    }
}

// 練り指示削除モーダルのイベント設定
function setupDeleteMixingInstructionModalEvents() {
    const modal = document.getElementById('delete-mixing-instruction-modal');
    const cancelBtn = document.getElementById('delete-mixing-modal-cancel');
    const confirmBtn = document.getElementById('delete-mixing-modal-confirm');
    
    // 既存のイベントリスナーを削除
    if (cancelBtn) {
        cancelBtn.removeEventListener('click', handleDeleteMixingModalCancel);
        cancelBtn.addEventListener('click', handleDeleteMixingModalCancel);
    }
    
    if (confirmBtn) {
        confirmBtn.removeEventListener('click', handleDeleteMixingModalConfirm);
        confirmBtn.addEventListener('click', handleDeleteMixingModalConfirm);
    }
    
    // モーダル外クリックで閉じる
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            handleDeleteMixingModalCancel();
        }
    });
}

// 練り指示削除モーダルキャンセル処理
function handleDeleteMixingModalCancel() {
    document.getElementById('delete-mixing-instruction-modal').style.display = 'none';
}

// 練り指示削除モーダル確認処理
function handleDeleteMixingModalConfirm() {
    if (!window.currentSelectedData) {
        console.error('選択中のデータがありません。');
        return;
    }
    
    const { factory, index, data } = window.currentSelectedData;
    
    // 練り混ぜ順エリアからデータを削除
    deleteMixingOrderData(factory, index);
    
    // 選択状態を解除
    clearMixingInstructionArea();
    
    // currentSelectedDataをクリア（削除後に古いデータが残らないように）
    window.currentSelectedData = null;
    
    // モーダルを閉じる
    document.getElementById('delete-mixing-instruction-modal').style.display = 'none';
    
    console.log('練り指示を削除しました');
}

// 練り混ぜ順エリアからデータを削除
function deleteMixingOrderData(factory, index) {
    if (factory === 'tochigi') {
        // 栃木工場の場合：練り混ぜ順テーブルの行を削除
        const tbody = document.getElementById('mixing-order-tbody');
        if (!tbody) return;
        
        const rows = tbody.querySelectorAll('tr');
        if (rows[index]) {
            rows[index].remove();
        }
        
        // 指示ボタンのdata-indexを再設定（削除後にインデックスを更新）
        const remainingRows = tbody.querySelectorAll('tr');
        remainingRows.forEach((row, newIndex) => {
            const instructionBtn = row.querySelector('.instruction-btn');
            if (instructionBtn) {
                instructionBtn.setAttribute('data-index', newIndex.toString());
            }
        });
    } else if (factory === 'ibaraki') {
        // 茨城工場の場合：バッチ割付・練混予定テーブルのセルを削除し、下のデータを上に詰める
        const data = window.currentSelectedData?.data;
        if (data && data.batchNo) {
            const targetCell = document.querySelector(`#batch-schedule-tbody .clickable-cell[data-batch-no="${data.batchNo}"]`);
            if (targetCell) {
                // セルの列インデックスを取得
                const columnIndex = Array.from(targetCell.parentNode.children).indexOf(targetCell);
                
                // その列のすべてのセルを取得
                const allRows = document.querySelectorAll('#batch-schedule-tbody tr');
                const columnCells = Array.from(allRows).map(row => row.children[columnIndex]);
                
                // 削除対象のセルの行インデックスを取得（テーブル全体での行インデックス）
                const targetRowIndex = Array.from(allRows).indexOf(targetCell.parentNode);
                
                // 削除対象セルより下のセルのデータを上に移動
                for (let i = targetRowIndex; i < columnCells.length - 1; i++) {
                    const currentCell = columnCells[i];
                    const nextCell = columnCells[i + 1];
                    
                    if (nextCell && nextCell.classList.contains('clickable-cell')) {
                        // 次のセルのデータを現在のセルに移動
                        currentCell.textContent = nextCell.textContent;
                        currentCell.style.border = nextCell.style.border;
                        currentCell.style.background = nextCell.style.background;
                        currentCell.className = nextCell.className;
                        
                        // データ属性を移動
                        const attributes = ['data-batch-no', 'data-strength', 'data-volume', 'data-line', 'data-project', 'data-is-completed'];
                        attributes.forEach(attr => {
                            if (nextCell.hasAttribute(attr)) {
                                currentCell.setAttribute(attr, nextCell.getAttribute(attr));
                            } else {
                                currentCell.removeAttribute(attr);
                            }
                        });
                    } else {
                        // 次のセルにデータがない場合は現在のセルを空にする
                        currentCell.textContent = '';
                        currentCell.style.border = 'none';
                        currentCell.style.background = 'transparent';
                        currentCell.className = '';
                        currentCell.removeAttribute('data-batch-no');
                        currentCell.removeAttribute('data-strength');
                        currentCell.removeAttribute('data-volume');
                        currentCell.removeAttribute('data-line');
                        currentCell.removeAttribute('data-project');
                        currentCell.removeAttribute('data-is-completed');
                    }
                }
                
                // 最後のセルを空にする
                const lastCell = columnCells[columnCells.length - 1];
                if (lastCell) {
                    lastCell.textContent = '';
                    lastCell.style.border = 'none';
                    lastCell.style.background = 'transparent';
                    lastCell.className = '';
                    lastCell.removeAttribute('data-batch-no');
                    lastCell.removeAttribute('data-strength');
                    lastCell.removeAttribute('data-volume');
                    lastCell.removeAttribute('data-line');
                    lastCell.removeAttribute('data-project');
                    lastCell.removeAttribute('data-is-completed');
                }
            }
        }
    }
}

// バッチャー選択selectorの表示/非表示を切り替える関数
function updateBatcherFilterSelectorDisplay(factoryValue) {
    const batcherFilterSelector = document.getElementById('batcher-filter-selector');
    if (batcherFilterSelector) {
        if (factoryValue === 'tochigi-factory') {
            batcherFilterSelector.style.display = '';
        } else {
            batcherFilterSelector.style.display = 'none';
        }
    }
}

// バッチャー選択selectorのイベント設定
function setupBatcherFilterSelectorEvents() {
    const batcherFilterSelector = document.getElementById('batcher-filter-selector');
    if (batcherFilterSelector) {
        batcherFilterSelector.addEventListener('change', function() {
            const factorySelector = document.querySelector('.factory-selector');
            if (factorySelector) {
                updateOrderTableData(factorySelector.value);
            }
        });
    }
}

// 注文追加ボタンの状態を更新する関数
function updateAddOrderButtonState() {
    const addOrderBtn = document.getElementById('add-order-btn');
    if (!addOrderBtn) return;
    
    const selectedCells = document.querySelectorAll('.date-cell.selected');
    const lightBlueCells = document.querySelectorAll('.date-cell.light-blue-bg');
    
    // 選択されたセルがある場合は有効、ない場合は無効
    if (selectedCells.length > 0 || lightBlueCells.length > 0) {
        addOrderBtn.disabled = false;
    } else {
        addOrderBtn.disabled = true;
    }
}


