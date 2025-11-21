// ========================================
// ラインエリア - 生産指示画面の処理
// ========================================

// 選択された製品のリスト
let selectedProducts = [];

// 生産指示画面の初期化
function initializeLineProductionInstructionScreen() {
    try {
        // 基本設定
        updateProductionDates();
        
        // ユーザーIDに応じてline-selectorを制御（生産指示画面用）
        if (typeof setupLineSelectorByUserId === 'function') {
            setupLineSelectorByUserId();
        }
        
        // ラインセレクターのイベント設定
        setupLineProductionSelectorEvents();
        
        // データ初期化（ユーザーIDに応じたラインを表示）
        const lineSelector = document.getElementById('production-instruction-line-selector');
        let initialLine = '栃木_建築A北';
        
        if (lineSelector) {
            // ユーザーIDに応じた初期ラインを設定
            const userId = localStorage.getItem('userId');
            if (userId === '000') {
                initialLine = '栃木_建築A北';
            } else if (userId === '111') {
                initialLine = '茨城_B1ライン';
            } else {
                // line-selectorの現在の値を取得
                initialLine = lineSelector.value || lineSelector.options[lineSelector.selectedIndex]?.textContent || '栃木_建築A北';
            }
        }
        
        updateLineProductionDisplay(initialLine);
        
        // 選択解除ボタンのイベント設定
        setupClearSelectionButtonForProduction();
        
        // 初期表示を更新（製品未選択状態）
        updateSelectedProductTotal();
        
        // バッチ割データの初期化
        initializeBatchAllocationTable();
        
        // バッチテーブルのクリック機能を初期化
        initializeBatchTableClickHandler();
        
        // 選択確定ボタンのイベント設定
        setupSelectionConfirmButton();
        
        // 出荷停止ボタンのイベント設定
        setupStopShipmentButton();
        
        // 出荷開始ボタンのイベント設定
        setupStartShipmentButton();
        
        // 打設完了ボタンのイベント設定
        setupCompletionButton();
        
        // アクションボタンの初期状態を設定
        updateActionButtonsState();
        
        // 打設完了ボタンの初期状態を設定
        updateCompletionButtonState();
        
        // QR読取ボタンのイベント設定
        setupProductionQRButton();
        
        // フィルターセレクターのイベント設定
        setupProductionFilterSelector();
        
        // 注文明細テーブルの初期化
        updateOrderDetailsTable(initialLine);
        
    } catch (error) {
        console.error('生産指示画面の初期化でエラーが発生しました:', error);
    }
}

// 日付更新関数
function updateProductionDates() {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    // 曜日の配列
    const weekdays = ['日', '月', '火', '水', '木', '金', '土'];

    // 今日の日付をフォーマット
    const todayFormatted = `${String(today.getMonth() + 1).padStart(2, '0')}/${String(today.getDate()).padStart(2, '0')} ${weekdays[today.getDay()]}`;
    
    // 翌日の日付をフォーマット
    const tomorrowFormatted = `${String(tomorrow.getMonth() + 1).padStart(2, '0')}/${String(tomorrow.getDate()).padStart(2, '0')} ${weekdays[tomorrow.getDay()]}`;

    // DOM要素を更新
    const todayElement = document.getElementById('production-today-date');
    const tomorrowElement = document.getElementById('production-tomorrow-date');
    
    if (todayElement) {
        todayElement.textContent = todayFormatted;
    }
    
    if (tomorrowElement) {
        tomorrowElement.textContent = tomorrowFormatted;
    }
}

// ラインセレクターのイベント設定
function setupLineProductionSelectorEvents() {
    const lineSelector = document.getElementById('production-instruction-line-selector');
    if (lineSelector) {
        // userIdに基づいてline-selectorを制御（既にsetupLineSelectorByUserIdで制御されているが、念のため再適用）
        if (typeof setupLineSelectorByUserId === 'function') {
            setupLineSelectorByUserId();
        }
        
        // 既存のイベントリスナーを削除してから追加
        const newLineSelector = lineSelector.cloneNode(true);
        lineSelector.parentNode.replaceChild(newLineSelector, lineSelector);
        
        // userId制御を再適用（クローン処理で設定が失われるため）
        const userId = localStorage.getItem('userId');
        const isUserIdControlled = userId === '000' || userId === '111';
        if (isUserIdControlled && typeof setupLineSelectorByUserId === 'function') {
            setupLineSelectorByUserId();
        }
        
        // イベントリスナーを追加
        const finalLineSelector = document.getElementById('production-instruction-line-selector');
        if (finalLineSelector && !finalLineSelector.disabled) {
            finalLineSelector.addEventListener('change', function() {
                updateLineProductionDisplay(this.value);
                // line-infoを更新
                if (typeof updateLineInfo === 'function') {
                    updateLineInfo();
                }
            });
        }
    }
}

// ライン選択時の表示更新
function updateLineProductionDisplay(selectedLine) {
    // ライン名から工場を特定
    let factory = null;
    if (selectedLine.startsWith('栃木_')) {
        factory = 'tochigi-factory';
    } else if (selectedLine.startsWith('茨城_')) {
        factory = 'ibaraki-factory';
    }
    
    // 茨城_B1ラインと茨城_B2ラインの場合は、茨城_Aラインのデータを参照
    let targetLineName = selectedLine;
    if (selectedLine === '茨城_B1ライン' || selectedLine === '茨城_B2ライン') {
        targetLineName = '茨城_Aライン';
    }
    
    if (!factory || !sharedScheduleData[factory] || !sharedScheduleData[factory][targetLineName]) {
        return;
    }
    
    const projects = sharedScheduleData[factory][targetLineName];
    
    // 選択されたライン名を保持（型枠番号の上に表示するため）
    window.selectedLineName = selectedLine;
    
    // プロジェクトセクションを動的に生成
    generateLineProjectSections(projects);
    
    // line-infoを更新
    if (typeof updateLineInfo === 'function') {
        updateLineInfo();
    }
    
    // 注文明細テーブルを更新
    updateOrderDetailsTable(selectedLine);
    
    // データ表示更新後にdate-cellのクリックイベントを再設定
    setTimeout(() => {
        setupProductionDateCellClickHandlers();
    }, 100);
}

// プロジェクトセクションを動的に生成する関数
function generateLineProjectSections(projects) {
    const container = document.getElementById('line-project-sections-container');
    if (!container) return;
    
    // 既存のプロジェクトセクションをクリア
    container.innerHTML = '';
    
    // 各プロジェクトセクションを生成
    Object.keys(projects).forEach(projectName => {
        const projectSection = createLineProjectSection(projectName, projects[projectName]);
        container.appendChild(projectSection);
    });
}

// プロジェクトセクションを作成する関数
function createLineProjectSection(projectName, projectDataArray) {
    const projectSection = document.createElement('div');
    projectSection.className = 'project-section';
    
    // プロジェクト名
    const projectNameElement = document.createElement('div');
    projectNameElement.className = 'project-name';
    projectNameElement.textContent = projectName;
    projectSection.appendChild(projectNameElement);
    
    // スケジュールテーブル
    const scheduleTable = document.createElement('div');
    scheduleTable.className = 'schedule-table';
    
    // formworkNoでグループ化（同じformworkNoのtodayとtomorrowを同じ行にまとめる）
    const groupedByFormworkNo = {};
    projectDataArray.forEach((data, index) => {
        // 空のデータ（idが空で、dateも空、または有効なデータがない）をスキップ
        const hasValidData = data.id && data.id.trim() !== '' && 
                            (data.date === 'today' || data.date === 'tomorrow');
        
        if (hasValidData) {
            const formworkNo = data.formworkNo || `No.${index + 1}`;
            if (!groupedByFormworkNo[formworkNo]) {
                groupedByFormworkNo[formworkNo] = {
                    today: null,
                    tomorrow: null,
                    formworkNo: formworkNo,
                    index: Object.keys(groupedByFormworkNo).length
                };
            }
            
            // todayとtomorrowをそれぞれ設定（複数のtodayはない前提）
            if (data.date === 'today') {
                groupedByFormworkNo[formworkNo].today = data;
            } else if (data.date === 'tomorrow') {
                groupedByFormworkNo[formworkNo].tomorrow = data;
            }
        }
    });
    
    // グループ化されたデータから行を生成
    Object.values(groupedByFormworkNo).forEach(group => {
        const scheduleRow = createLineScheduleRowFromGroup(group);
            scheduleTable.appendChild(scheduleRow);
    });
    
    projectSection.appendChild(scheduleTable);
    return projectSection;
}

// スケジュール行を作成する関数（後方互換性のため残す）
function createLineScheduleRow(data, index) {
    const scheduleRow = document.createElement('div');
    scheduleRow.className = 'schedule-row';
    
    // 行ラベル
    const rowLabel = document.createElement('div');
    rowLabel.className = 'row-label';
    
    const lineName = document.createElement('div');
    lineName.className = 'line-name';
    // 現在選択されているライン名を取得
    lineName.textContent = window.selectedLineName || '';
    rowLabel.appendChild(lineName);
    
    const noLabel = document.createElement('div');
    noLabel.className = 'no-label';
    // データにformworkNoがある場合はそれを使用、ない場合はインデックス+1から生成
    noLabel.textContent = data.formworkNo || `No.${index + 1}`;
    rowLabel.appendChild(noLabel);
    
    scheduleRow.appendChild(rowLabel);
    
    // 日付セル
    const dateCells = document.createElement('div');
    dateCells.className = 'date-cells';
    
    // 今日のセル
    const todayCell = createLineDateCell(data, 'today');
    dateCells.appendChild(todayCell);
    
    // 明日のセル
    const tomorrowCell = createLineDateCell(data, 'tomorrow');
    dateCells.appendChild(tomorrowCell);
    
    scheduleRow.appendChild(dateCells);
    return scheduleRow;
}

// グループ化されたデータからスケジュール行を作成する関数
function createLineScheduleRowFromGroup(group) {
    const scheduleRow = document.createElement('div');
    scheduleRow.className = 'schedule-row';
    
    // 行ラベル
    const rowLabel = document.createElement('div');
    rowLabel.className = 'row-label';
    
    const lineName = document.createElement('div');
    lineName.className = 'line-name';
    // 現在選択されているライン名を取得
    lineName.textContent = window.selectedLineName || '';
    rowLabel.appendChild(lineName);
    
    const noLabel = document.createElement('div');
    noLabel.className = 'no-label';
    noLabel.textContent = group.formworkNo;
    rowLabel.appendChild(noLabel);
    
    scheduleRow.appendChild(rowLabel);
    
    // 日付セル
    const dateCells = document.createElement('div');
    dateCells.className = 'date-cells';
    
    // 今日のセル（group.todayがあればそのデータを使用、なければnull）
    const todayCell = createLineDateCell(group.today, 'today');
    dateCells.appendChild(todayCell);
    
    // 明日のセル（group.tomorrowがあればそのデータを使用、なければnull）
    const tomorrowCell = createLineDateCell(group.tomorrow, 'tomorrow');
    dateCells.appendChild(tomorrowCell);
    
    scheduleRow.appendChild(dateCells);
    return scheduleRow;
}

// 日付セルを作成する関数
function createLineDateCell(data, dateType) {
    const dateCell = document.createElement('div');
    
    // dataがnullまたはundefinedの場合は空のセルを作成
    if (!data || !data.id || data.date !== dateType) {
        // データがない場合（空白セル）
        dateCell.className = 'date-cell empty';
        dateCell.innerHTML = '';
        return dateCell;
    }
    
        // データがある場合
        // statusが「打設完了」またはpouringStatusが'completed'の場合はcompletedクラスを追加
        const isCompleted = data.status === '打設完了' || data.pouringStatus === 'completed';
        dateCell.className = `date-cell ${data.color}${isCompleted ? ' completed' : ''}`;
        
        // 複数データを/で区切って表示
        const formattedData = formatLineMultipleData(data.value, data.unit);
        
        dateCell.innerHTML = `
            <div class="status">${data.status}</div>
            <div class="id">${data.id}</div>
            <div class="value">${formattedData.value}</div>
            <div class="unit">${formattedData.unit}</div>
        `;
        
        // データ属性を設定
        dateCell.setAttribute('data-product-id', data.id);
        dateCell.setAttribute('data-value', formattedData.value);
        dateCell.setAttribute('data-unit', formattedData.unit);
        dateCell.setAttribute('data-status', data.status);
        // dateColumnを設定（1列目=当日、2列目=翌日）
        if (data.dateColumn !== undefined) {
            dateCell.setAttribute('data-date-column', data.dateColumn);
        } else {
            // 後方互換性のため、dateから推測
            const column = dateType === 'today' ? 1 : (dateType === 'tomorrow' ? 2 : 0);
            dateCell.setAttribute('data-date-column', column);
    }
    
    return dateCell;
}

// データを表示用にフォーマットする関数
function formatLineMultipleData(value, unit) {
    // 配列データの場合は/で区切って表示
    if (Array.isArray(value) && Array.isArray(unit)) {
        // nullや空文字列を除外して有効なデータのみを取得
        const validValues = value.filter(v => v !== null && v !== undefined && v !== '');
        const validUnits = unit.filter(u => u && u.trim() !== '');
        
        // データが1つだけの場合はそのまま表示
        if (validValues.length <= 1) {
            return {
                value: validValues[0] !== null && validValues[0] !== undefined ? validValues[0].toString() : '',
                unit: validUnits[0] || ''
            };
        }
        
        // 複数データの場合は/で区切って表示（最大4つまで）
        const maxItems = Math.min(validValues.length, 4);
        const displayValues = validValues.slice(0, maxItems);
        const displayUnits = validUnits.slice(0, maxItems);
        
        return {
            value: displayValues.map(v => v !== null && v !== undefined ? v.toString() : '').join('/'),
            unit: displayUnits.join('/')
        };
    }
    
    // 文字列データの場合はそのまま返す
    if (typeof value === 'string' && typeof unit === 'string') {
        return {
            value: value,
            unit: unit
        };
    }
    
    // その他の場合は空文字列を返す
    return {
        value: '',
        unit: ''
    };
}

// 日付セルクリックイベントハンドラーを設定する関数
function setupProductionDateCellClickHandlers() {
    const dateCells = document.querySelectorAll('#line-project-sections-container .date-cell');
    dateCells.forEach(cell => {
        // 既存のイベントリスナーを削除
        cell.removeEventListener('click', handleProductionDateCellClick);
        // 新しいイベントリスナーを追加
        cell.addEventListener('click', handleProductionDateCellClick);
    });
}

// 日付セルのクリック処理
function handleProductionDateCellClick(event) {
    const cell = event.currentTarget;
    
    // 空白セルはクリックできない
    if (cell.classList.contains('empty')) {
        return;
    }
    
    // 選択前の製品数を記録
    const previousProductCount = selectedProducts.length;
    
    // 選択状態を切り替え
    if (cell.classList.contains('selected')) {
        // 既に選択されている場合は選択解除
        cell.classList.remove('selected');
        removeSelectedProduct(cell);
    } else {
        // statusをチェック
        const status = cell.getAttribute('data-status');
        if (status !== '打設前検査完了' && status !== '打設完了') {
            alert('打設前検査完了していない製品は注文できません。');
            return;
        }
        
        // 複数選択の検証
        if (!validateLineMultipleSelection(cell)) {
            return;
        }
        // 選択状態を追加
        cell.classList.add('selected');
        addSelectedProduct(cell);
    }
    
    // 選択後の製品数を取得
    const currentProductCount = selectedProducts.length;
    
    // 製品数が変更された場合は注文内容詳細とバッチテーブルをクリア
    if (previousProductCount !== currentProductCount) {
        clearOrderDetailsDisplay();
        updateBatchAllocationTable([]);
        // バッチ割の表示をクリア
        const batchDivisionDisplay = document.getElementById('batch-division-display');
        if (batchDivisionDisplay) {
            batchDivisionDisplay.textContent = '';
        }
    }
    
    // 選択解除ボタンの表示/非表示を更新
    updateClearSelectionButtonVisibilityForProduction();
    
    // 選択製品リストを更新
    updateSelectedProductsList();
}

// 選択された製品を追加
function addSelectedProduct(cell) {
    const productId = cell.getAttribute('data-product-id');
    const value = cell.getAttribute('data-value');
    const unit = cell.getAttribute('data-unit');
    const status = cell.getAttribute('data-status');
    
    // 既に追加されている場合はスキップ
    if (selectedProducts.find(p => p.id === productId && p.value === value && p.unit === unit)) {
        return;
    }
    
    selectedProducts.push({
        id: productId,
        value: value,
        unit: unit,
        status: status,
        cell: cell
    });
}

// 選択された製品を削除
function removeSelectedProduct(cell) {
    const productId = cell.getAttribute('data-product-id');
    const value = cell.getAttribute('data-value');
    const unit = cell.getAttribute('data-unit');
    
    selectedProducts = selectedProducts.filter(p => 
        !(p.id === productId && p.value === value && p.unit === unit)
    );
}

// ========================================
// 複数選択検証処理
// ========================================

// 複数選択の検証
function validateLineMultipleSelection(cell) {
    const selectedCells = document.querySelectorAll('#line-project-sections-container .date-cell.selected');
    if (selectedCells.length > 0) {
        // プロジェクト名と強度を比較
        const comparisonResult = canSelectMultipleLineCells(Array.from(selectedCells), cell);
        if (!comparisonResult.allowed) {
            // エラー表示
            alert(comparisonResult.errorMessage);
            return false;
        }
    }
    return true;
}

// 複数セル選択時の検証関数
function canSelectMultipleLineCells(selectedCells, newCell) {
    // 新しくクリックされたセルの強度を取得
    const newCellUnits = getLineCellUnits(newCell);
    
    // 新しくクリックされたセルの調合Noを取得
    const newCellMixingNos = getLineCellMixingNos(newCell);
    
    // 新しくクリックされたセルのプロジェクト名を取得
    const newCellProjectName = getLineCellProjectName(newCell);
    
    // 新しくクリックされたセルの日付を取得
    const newCellDate = getLineCellDate(newCell);
    
    // 既に選択されているセルの強度、調合No、プロジェクト名、日付を取得
    const selectedUnits = [];
    const selectedMixingNos = [];
    const selectedProjectNames = [];
    const selectedDates = [];
    selectedCells.forEach(cell => {
        const units = getLineCellUnits(cell);
        const mixingNos = getLineCellMixingNos(cell);
        const projectName = getLineCellProjectName(cell);
        const date = getLineCellDate(cell);
        selectedUnits.push(units);
        selectedMixingNos.push(mixingNos);
        selectedProjectNames.push(projectName);
        selectedDates.push(date);
    });
    
    // 日付が同じかチェック
    const hasSameDate = selectedDates.every(date => date === newCellDate);
    if (!hasSameDate) {
        return {
            allowed: false,
            errorMessage: 'すでに選択している製品と同じ日付の製品しか選択できません。'
        };
    }
    
    // プロジェクト名が同じかチェック
    const hasSameProjectName = selectedProjectNames.every(projectName => projectName === newCellProjectName);
    if (!hasSameProjectName) {
        return {
            allowed: false,
            errorMessage: 'すでに選択している製品の物件名と同一の物件名の製品しか選択できません。'
        };
    }
    
    // 既に選択されているセル全体の共通強度を取得
    const commonUnits = getCommonLineUnits(selectedUnits);
    
    // 新しくクリックされたセルの強度と、既に選択されているセル全体の共通強度を比較
    const hasCommonUnit = hasCommonLineUnitValue(newCellUnits, commonUnits);
    if (!hasCommonUnit) {
        return {
            allowed: false,
            errorMessage: 'すでに選択している製品の強度と同一の強度が、登録されている製品しか複数選択できません。'
        };
    }
    
    // 調合Noのチェック：共通の強度について、少なくとも1つの強度で調合Noが一致していればOK
    const commonMixingNos = getCommonLineMixingNos(selectedMixingNos, selectedUnits, commonUnits);
    
    // 新しくクリックされたセルと、既に選択されているセルで、共通の強度かつ調合Noが一致するものが1つでもあるかチェック
    let hasMatchingMixingNo = false;
    for (let i = 0; i < commonUnits.length; i++) {
        const commonUnit = commonUnits[i];
        const commonMixingNo = commonMixingNos[commonUnit];
        
        // 新しくクリックされたセルにこの強度があるかチェック
        const newCellUnitIndex = newCellUnits.findIndex(u => u === commonUnit);
        if (newCellUnitIndex !== -1) {
            const newCellMixingNo = newCellMixingNos[newCellUnitIndex];
            // 調合Noが一致しているかチェック
            if (commonMixingNo && newCellMixingNo === commonMixingNo) {
                hasMatchingMixingNo = true;
                break;
            }
        }
    }
    
    if (!hasMatchingMixingNo) {
        return {
            allowed: false,
            errorMessage: 'すでに選択している製品の強度と調合Noが一致している製品しか複数選択できません。'
        };
    }
    
    return {
        allowed: true,
        errorMessage: ''
    };
}

// セルから強度（unit）を取得する関数
function getLineCellUnits(cell) {
    const unitElements = cell.querySelectorAll('.unit');
    const units = [];
    unitElements.forEach(unitElement => {
        const unitText = unitElement.textContent.trim();
        if (unitText && unitText !== '') {
            // 複数の強度が/で区切られている場合は分割
            if (unitText.includes('/')) {
                const splitUnits = unitText.split('/');
                splitUnits.forEach(unit => {
                    const trimmedUnit = unit.trim();
                    if (trimmedUnit && trimmedUnit !== '') {
                        units.push(trimmedUnit);
                    }
                });
            } else {
                units.push(unitText);
            }
        }
    });
    return units;
}

// セルからプロジェクト名を取得する関数
function getLineCellProjectName(cell) {
    // セルが属するproject-sectionを取得
    const projectSection = cell.closest('.project-section');
    if (!projectSection) {
        return '';
    }
    
    // project-name要素を取得
    const projectNameElement = projectSection.querySelector('.project-name');
    if (!projectNameElement) {
        return '';
    }
    
    return projectNameElement.textContent.trim();
}

// セルから日付を取得する関数
function getLineCellDate(cell) {
    // セルが属するdate-cellsコンテナを取得
    const dateCellsContainer = cell.closest('.date-cells');
    if (!dateCellsContainer) {
        return '';
    }
    
    // セルが今日のセルか明日のセルかを判定
    const allDateCells = dateCellsContainer.querySelectorAll('.date-cell');
    const cellIndex = Array.from(allDateCells).indexOf(cell);
    
    if (cellIndex === 0) {
        // 最初のセル（今日）
        const todayDateElement = document.getElementById('production-today-date');
        if (todayDateElement) {
            const dateText = todayDateElement.textContent.trim();
            return dateText;
        }
    } else if (cellIndex === 1) {
        // 2番目のセル（明日）
        const tomorrowDateElement = document.getElementById('production-tomorrow-date');
        if (tomorrowDateElement) {
            const dateText = tomorrowDateElement.textContent.trim();
            return dateText;
        }
    }
    
    return '';
}

// 既に選択されているセル全体の共通強度を取得する関数
function getCommonLineUnits(selectedUnits) {
    if (selectedUnits.length === 0) {
        return [];
    }
    
    if (selectedUnits.length === 1) {
        // 1つのセルの場合は、そのセルの強度を返す
        return selectedUnits[0].filter(unit => unit && unit.trim() !== '');
    }
    
    // 複数のセルの場合は、すべてのセルに共通する強度を返す
    const firstUnits = selectedUnits[0].filter(unit => unit && unit.trim() !== '');
    const commonUnits = [];
    
    for (let i = 0; i < firstUnits.length; i++) {
        const unit = firstUnits[i];
        let isCommon = true;
        
        // 他のすべてのセルにも同じ強度があるかチェック
        for (let j = 1; j < selectedUnits.length; j++) {
            const otherUnits = selectedUnits[j].filter(u => u && u.trim() !== '');
            if (!otherUnits.includes(unit)) {
                isCommon = false;
                break;
            }
        }
        
        if (isCommon) {
            commonUnits.push(unit);
        }
    }
    
    return commonUnits;
}

// セルから元データを取得する関数
function getLineCellData(cell) {
    const productId = cell.getAttribute('data-product-id');
    if (!productId) {
        return null;
    }
    
    // ライン名から工場を特定
    const lineSelector = document.getElementById('production-instruction-line-selector');
    if (!lineSelector) {
        return null;
    }
    
    const selectedLine = lineSelector.value;
    let factory = null;
    if (selectedLine.startsWith('栃木_')) {
        factory = 'tochigi-factory';
    } else if (selectedLine.startsWith('茨城_')) {
        factory = 'ibaraki-factory';
    }
    
    // 茨城_B1ラインと茨城_B2ラインの場合は、茨城_Aラインのデータを参照
    let targetLineName = selectedLine;
    if (selectedLine === '茨城_B1ライン' || selectedLine === '茨城_B2ライン') {
        targetLineName = '茨城_Aライン';
    }
    
    if (!factory || !sharedScheduleData[factory] || !sharedScheduleData[factory][targetLineName]) {
        return null;
    }
    
    const projects = sharedScheduleData[factory][targetLineName];
    
    // プロジェクト名を取得
    const projectName = getLineCellProjectName(cell);
    if (!projectName || !projects[projectName]) {
        return null;
    }
    
    // 製品IDに一致するデータを検索
    const projectData = projects[projectName];
    const dateColumn = cell.getAttribute('data-date-column');
    
    for (let i = 0; i < projectData.length; i++) {
        const data = projectData[i];
        if (data.id === productId) {
            // dateColumnが一致するかチェック
            const dataDateColumn = data.dateColumn !== undefined ? data.dateColumn : 
                (data.date === 'today' ? 1 : (data.date === 'tomorrow' ? 2 : 0));
            if (dateColumn && dataDateColumn.toString() === dateColumn.toString()) {
                return data;
            }
        }
    }
    
    return null;
}

// セルから調合No（mixingNo）を取得する関数
function getLineCellMixingNos(cell) {
    const data = getLineCellData(cell);
    if (!data || !data.mixingNo) {
        return [];
    }
    
    // unitとmixingNoを対応させる
    const units = getLineCellUnits(cell);
    const mixingNos = [];
    
    if (Array.isArray(data.unit) && Array.isArray(data.mixingNo)) {
        // セルから取得したunitの順序で、対応するmixingNoを取得
        units.forEach(unit => {
            // データのunit配列から該当するunitのインデックスを検索
            const unitIndex = data.unit.findIndex(u => u === unit);
            if (unitIndex !== -1 && data.mixingNo[unitIndex] && data.mixingNo[unitIndex].trim() !== '') {
                mixingNos.push(data.mixingNo[unitIndex]);
            } else {
                mixingNos.push('');
            }
        });
    }
    
    return mixingNos;
}

// 2つの強度配列に共通の値があるかチェックする関数
function hasCommonLineUnitValue(units1, units2) {
    // 空文字列を除外した有効な強度のみを取得
    const validUnits1 = units1.filter(unit => unit && unit.trim() !== '');
    const validUnits2 = units2.filter(unit => unit && unit.trim() !== '');
    
    for (let i = 0; i < validUnits1.length; i++) {
        for (let j = 0; j < validUnits2.length; j++) {
            if (validUnits1[i] === validUnits2[j]) {
                return true;
            }
        }
    }
    return false;
}

// 共通の強度について、共通の調合Noを取得する関数
function getCommonLineMixingNos(selectedMixingNos, selectedUnits, commonUnits) {
    if (selectedMixingNos.length === 0 || commonUnits.length === 0) {
        return {};
    }
    
    // 共通の強度ごとに調合Noをマッピング
    const commonMixingNosMap = {};
    
    commonUnits.forEach(commonUnit => {
        const mixingNosForUnit = [];
        
        // 各セルから、共通の強度に対応する調合Noを取得
        for (let i = 0; i < selectedUnits.length; i++) {
            const units = selectedUnits[i];
            const mixingNos = selectedMixingNos[i];
            
            const unitIndex = units.findIndex(u => u === commonUnit);
            if (unitIndex !== -1 && mixingNos[unitIndex]) {
                mixingNosForUnit.push(mixingNos[unitIndex]);
            }
        }
        
        // すべてのセルで同じ調合Noかチェック
        if (mixingNosForUnit.length > 0) {
            const firstMixingNo = mixingNosForUnit[0];
            const allSame = mixingNosForUnit.every(mn => mn === firstMixingNo);
            if (allSame) {
                commonMixingNosMap[commonUnit] = firstMixingNo;
            }
        }
    });
    
    return commonMixingNosMap;
}

// 新しくクリックされたセルの強度と調合Noが、共通の強度と調合Noと一致しているかチェック
function hasCommonLineMixingNoValue(newCellUnits, newCellMixingNos, commonUnits, commonMixingNos) {
    // 共通の強度ごとにチェック
    for (let i = 0; i < commonUnits.length; i++) {
        const commonUnit = commonUnits[i];
        const commonMixingNo = commonMixingNos[commonUnit];
        
        // 新しくクリックされたセルに共通の強度があるかチェック
        const newCellUnitIndex = newCellUnits.findIndex(u => u === commonUnit);
        if (newCellUnitIndex !== -1) {
            // 調合Noも一致している必要がある
            const newCellMixingNo = newCellMixingNos[newCellUnitIndex];
            if (newCellMixingNo !== commonMixingNo) {
                return false;
            }
        }
    }
    
    return true;
}

// 選択製品リストを更新
function updateSelectedProductsList() {
    const listContainer = document.getElementById('selected-products-list');
    if (!listContainer) return;
    
    listContainer.innerHTML = '';
    
    selectedProducts.forEach((product, index) => {
        const item = document.createElement('div');
        item.className = 'selected-product-item';
        item.innerHTML = `
            <div class="product-number">
                <span>${index + 1}</span>
            </div>
            <div class="product-details">
                <span>${product.id}</span>
                <span>${product.value}</span>
                <span>${product.unit}</span>
            </div>
        `;
        listContainer.appendChild(item);
    });
    
    // unitオプションを更新（先に実行）
    updateLineUnitOptions();
    
    // 選択された製品の総量を計算して表示
    updateSelectedProductTotal();
    
    // 選択確定ボタンの状態を更新
    updateSelectionConfirmButtonState();
    
    // 打設完了ボタンの状態を更新
    updateCompletionButtonState();
}

// 選択された製品の総量を更新
function updateSelectedProductTotal() {
    const strengthDisplayRow = document.querySelector('#production-instruction-screen .strength-display-row');
    const strengthDisplay = document.getElementById('selected-strength');
    const unitSelect = document.getElementById('selected-unit-display');
    
    if (selectedProducts.length === 0) {
        // 製品が選択されていない場合
        if (strengthDisplayRow) {
            strengthDisplayRow.style.visibility = 'hidden';
        }
        if (unitSelect) {
            unitSelect.disabled = true;
            unitSelect.innerHTML = '<option value="">選択してください</option>';
        }
        // mixingNoもクリア
        const mixingNoDisplay = document.getElementById('selected-mixing-no');
        if (mixingNoDisplay) {
            mixingNoDisplay.textContent = '';
        }
        // 選択確定ボタンの状態を更新
        updateSelectionConfirmButtonState();
        // アクションボタンの状態を更新
        updateActionButtonsState();
        return;
    }
    
    // selected-unit-displayが選択されているかチェック
    updateStrengthDisplayVisibility();
    
    // 選択されたunitに基づいて総量を計算
    const selectedUnit = unitSelect ? unitSelect.value : '';
    if (selectedUnit && selectedUnit !== '' && selectedUnit !== '選択してください') {
        // 選択されたunitに一致する製品の数量の合計を計算
        const totalValue = selectedProducts.reduce((sum, product) => {
            // product.unitが/で区切られている場合とそうでない場合を処理
            const productUnits = product.unit.includes('/') ? product.unit.split('/') : [product.unit];
            const productValues = product.value.includes('/') ? product.value.split('/') : [product.value];
            
            // 選択されたunitがproduct.unitに含まれているかチェック
            const unitIndex = productUnits.findIndex(u => u.trim() === selectedUnit);
            if (unitIndex !== -1) {
                // 対応するvalueを取得
                const value = productValues[unitIndex] || productValues[0] || '0';
                return sum + parseFloat(value || 0);
            }
            return sum;
        }, 0);
        
        // 総量を表示
        if (strengthDisplay) {
            strengthDisplay.textContent = totalValue.toFixed(2);
        }
        
        // 選択された強度のmixingNoを表示
        const mixingNoDisplay = document.getElementById('selected-mixing-no');
        if (mixingNoDisplay && unitSelect.selectedIndex >= 0) {
            const selectedOption = unitSelect.options[unitSelect.selectedIndex];
            const mixingNo = selectedOption ? selectedOption.getAttribute('data-mixing-no') || '' : '';
            mixingNoDisplay.textContent = mixingNo;
        }
    } else {
        // unitが選択されていない場合は0を表示
        if (strengthDisplay) {
            strengthDisplay.textContent = '0.00';
        }
        // mixingNoもクリア
        const mixingNoDisplay = document.getElementById('selected-mixing-no');
        if (mixingNoDisplay) {
            mixingNoDisplay.textContent = '';
        }
    }
    
    // 選択確定ボタンの状態を更新（updateLineUnitOptions内で既に呼ばれているが、念のため）
    updateSelectionConfirmButtonState();
}

// strength-display-rowの表示/非表示を更新
function updateStrengthDisplayVisibility() {
    const strengthDisplayRow = document.querySelector('#production-instruction-screen .strength-display-row');
    const unitSelect = document.getElementById('selected-unit-display');
    
    if (!strengthDisplayRow || !unitSelect) return;
    
    // selected-unit-displayが「選択してください」の場合は非表示
    if (unitSelect.value === '' || unitSelect.value === '選択してください') {
        strengthDisplayRow.style.visibility = 'hidden';
    } else {
        strengthDisplayRow.style.visibility = 'visible';
    }
}

// unitオプションを更新する関数
function updateLineUnitOptions() {
    const unitSelect = document.getElementById('selected-unit-display');
    if (!unitSelect) return;
    
    // 選択されているセルを取得
    const selectedCells = document.querySelectorAll('#line-project-sections-container .date-cell.selected');
    
    let unitOptions = [];
    
    if (selectedCells.length === 1) {
        // 1製品選択の場合：その製品のすべてのunitを表示
        unitOptions = getSingleLineProductUnitOptions(selectedCells[0]);
    } else if (selectedCells.length > 1) {
        // 複数製品選択の場合：共通のunitのみを表示
        unitOptions = getCommonLineUnitOptions(Array.from(selectedCells));
    }
    
    // セレクトボックスを更新
    updateLineUnitDropdown(unitOptions);
    
    // セレクトボックスを有効化
    unitSelect.disabled = false;
}

// 単一製品のunitオプションを取得（強度と調合Noのペア）
function getSingleLineProductUnitOptions(cell) {
    const unitOptions = [];
    const units = getLineCellUnits(cell);
    const mixingNos = getLineCellMixingNos(cell);
    
    // 強度と調合Noのペアを作成
    for (let i = 0; i < units.length; i++) {
        const unit = units[i];
        const mixingNo = mixingNos[i] || '';
        if (unit && unit.trim() !== '') {
            unitOptions.push({
                unit: unit,
                mixingNo: mixingNo
            });
        }
    }
    
    return unitOptions;
}

// 複数製品の共通unitオプションを取得（強度と調合Noが一致しているもののみ）
function getCommonLineUnitOptions(cells) {
    if (cells.length === 0) {
        return [];
    }
    
    // 各セルの強度と調合Noを取得
    const allUnits = [];
    const allMixingNos = [];
    
    cells.forEach(cell => {
        const units = getLineCellUnits(cell);
        const mixingNos = getLineCellMixingNos(cell);
        allUnits.push(units);
        allMixingNos.push(mixingNos);
    });
    
    // 共通の強度を取得
    const commonUnits = getCommonLineUnits(allUnits);
    
    // 共通の強度について、調合Noも一致しているものを取得
    const commonMixingNos = getCommonLineMixingNos(allMixingNos, allUnits, commonUnits);
    
    // 強度と調合Noのペアを作成
    const unitOptions = [];
    commonUnits.forEach(unit => {
        const mixingNo = commonMixingNos[unit];
        if (mixingNo) {
            unitOptions.push({
                unit: unit,
                mixingNo: mixingNo
                });
            }
        });
        
    return unitOptions;
}

// unitセレクトボックスを更新
function updateLineUnitDropdown(unitOptions) {
    const unitSelect = document.getElementById('selected-unit-display');
    if (!unitSelect) return;
    
    // 既存のオプションをクリア
    unitSelect.innerHTML = '<option value="">選択してください</option>';
    
    // 新しいオプションを追加
    unitOptions.forEach(unitOption => {
        const option = document.createElement('option');
        // 強度のみをvalueとtextContentに設定（調合Noは別途取得）
        option.value = unitOption.unit;
        option.textContent = unitOption.unit;
        // 調合Noをdata属性に保存
        option.setAttribute('data-mixing-no', unitOption.mixingNo || '');
        unitSelect.appendChild(option);
    });
    
    // オプションが1つだけの場合は自動選択
    if (unitOptions.length === 1) {
        unitSelect.value = unitOptions[0].unit;
        // 自動選択された場合も総量を更新（mixingNoも表示される）
        updateSelectedProductTotal();
        // アクションボタンの状態を更新
        updateActionButtonsState();
    } else {
        // オプションが複数または0の場合、mixingNoをクリア
        const mixingNoDisplay = document.getElementById('selected-mixing-no');
        if (mixingNoDisplay) {
            mixingNoDisplay.textContent = '';
        }
        // アクションボタンの状態を更新
        updateActionButtonsState();
    }
    
    // strength-display-rowの表示/非表示を更新
    updateStrengthDisplayVisibility();
    
    // unitSelectの変更イベントを設定
    unitSelect.onchange = function() {
        updateStrengthDisplayVisibility();
        // 選択されたunitに基づいて総量を更新
        updateSelectedProductTotal();
        // 選択確定が解除されるイメージなので、注文内容詳細とバッチテーブルをクリア
        clearOrderDetailsDisplay();
        updateBatchAllocationTable([]);
        // バッチ割の表示をクリア
        const batchDivisionDisplay = document.getElementById('batch-division-display');
        if (batchDivisionDisplay) {
            batchDivisionDisplay.textContent = '';
        }
        // 選択確定ボタンの状態を更新
        updateSelectionConfirmButtonState();
        // アクションボタンの状態を更新
        updateActionButtonsState();
    };
    
    // 選択確定ボタンの状態を更新
    updateSelectionConfirmButtonState();
}

// 選択解除ボタンの表示/非表示を更新
function updateClearSelectionButtonVisibilityForProduction() {
    const clearBtn = document.querySelector('#production-instruction-screen .clear-selection-btn');
    const hasSelections = selectedProducts.length > 0;
    
    if (clearBtn) {
        clearBtn.style.display = hasSelections ? 'block' : 'none';
    }
}

// 選択解除ボタンのイベント設定
function setupClearSelectionButtonForProduction() {
    const clearBtn = document.querySelector('#production-instruction-screen .clear-selection-btn');
    if (clearBtn) {
        clearBtn.addEventListener('click', function() {
            clearAllProductionSelections();
        });
    }
}

// すべての選択を解除
function clearAllProductionSelections() {
    // すべての選択されたセルからselectedクラスを削除
    const selectedCells = document.querySelectorAll('#line-project-sections-container .date-cell.selected');
    selectedCells.forEach(cell => {
        cell.classList.remove('selected');
    });
    
    // 選択製品リストをクリア
    selectedProducts = [];
    
    // 注文内容詳細をクリア
    clearOrderDetailsDisplay();
    
    // バッチ割テーブルをクリア
    updateBatchAllocationTable([]);
    
    // バッチ割の表示をクリア
    const batchDivisionDisplay = document.getElementById('batch-division-display');
    if (batchDivisionDisplay) {
        batchDivisionDisplay.textContent = '';
    }
    
    // 選択製品リストを更新
    updateSelectedProductsList();
    
    // 選択解除ボタンを非表示
    updateClearSelectionButtonVisibilityForProduction();
    
    // 選択確定ボタンの状態を更新
    updateSelectionConfirmButtonState();
    
    // 打設完了ボタンの状態を更新
    updateCompletionButtonState();
}

// バッチ割テーブルの初期化
function initializeBatchAllocationTable() {
    const batchTableWrapper = document.querySelector('#production-instruction-screen .batch-info-table-wrapper');
    if (!batchTableWrapper) return;
    
    const batchTable = batchTableWrapper.querySelector('.batch-info-table');
    if (!batchTable) return;
    
    const tbody = batchTable.querySelector('tbody');
    if (!tbody) return;
    
    // 初期表示時は空のテーブルを表示（ヘッダーのみ）
    tbody.innerHTML = '';
}

// バッチ割テーブルを更新する関数
function updateBatchAllocationTable(batchDataArray) {
    // order-details-tableの行が選択されている場合、空配列でクリアしない
    const selectedOrderRow = document.querySelector('.order-details-table tbody tr.selected');
    if (selectedOrderRow && (!batchDataArray || batchDataArray.length === 0)) {
        return;
    }
    
    const batchTableWrapper = document.querySelector('#production-instruction-screen .batch-info-table-wrapper');
    if (!batchTableWrapper) return;
    
    const batchTable = batchTableWrapper.querySelector('.batch-info-table');
    if (!batchTable) return;
    
    const tbody = batchTable.querySelector('tbody');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    // バッチデータがない場合は空のテーブルを表示（ヘッダーのみ）
    if (!batchDataArray || batchDataArray.length === 0) {
        // アクションボタンの状態を更新
        updateActionButtonsState();
        return;
    }
    
    // バッチデータを表示（データの数に合わせて行を生成）
    batchDataArray.forEach((batch, index) => {
        const row = document.createElement('tr');
        
        // ステータスに応じたクラスを設定
        let statusClass = '';
        if (batch.status === '出荷済') {
            statusClass = 'status-shipped';
        } else if (batch.status === '練混中') {
            statusClass = 'status-mixing';
        } else if (batch.status === '依頼中') {
            statusClass = 'status-requested';
        } else if (batch.status === '出荷停止') {
            statusClass = 'status-stopped';
        }
        
        row.innerHTML = `
            <td>${batch.no}</td>
            <td>${parseFloat(batch.m3).toFixed(2)}</td>
            <td class="${statusClass}">${batch.status}</td>
        `;
        tbody.appendChild(row);
    });
    
    // バッチテーブルのクリック機能を再初期化
    initializeBatchTableClickHandler();
    
    // アクションボタンの状態を更新
    updateActionButtonsState();
}

// 選択確定ボタンのイベント設定
function setupSelectionConfirmButton() {
    const confirmBtn = document.querySelector('.selection-confirm-btn');
    if (confirmBtn) {
        confirmBtn.addEventListener('click', handleSelectionConfirm);
    }
    // 初期状態でボタンを無効化
    updateSelectionConfirmButtonState();
}

// 打設完了ボタンの有効/無効を更新
function updateCompletionButtonState() {
    const completionBtn = document.querySelector('#production-instruction-screen .completion-btn');
    if (!completionBtn) return;
    
    // date-cellが1つ以上選択されているかチェック
    const hasSelectedProducts = selectedProducts.length > 0;
    
    // 選択されている場合のみボタンを有効化
    if (hasSelectedProducts) {
        completionBtn.disabled = false;
    } else {
        completionBtn.disabled = true;
    }
}

// 選択確定ボタンの有効/無効を更新
function updateSelectionConfirmButtonState() {
    const confirmBtn = document.querySelector('.selection-confirm-btn');
    if (!confirmBtn) return;
    
    // selected-products-listに1つでもデータがあるかチェック
    const selectedProductsList = document.getElementById('selected-products-list');
    const hasProducts = selectedProductsList && selectedProductsList.children.length > 0;
    
    // selected-unit-displayのvalueが「選択してください」以外かチェック
    const unitSelect = document.getElementById('selected-unit-display');
    const unitValue = unitSelect ? unitSelect.value : '';
    const isUnitSelected = unitValue && unitValue !== '' && unitValue !== '選択してください';
    
    // 条件を満たしている場合のみボタンを有効化
    if (hasProducts && isUnitSelected) {
        confirmBtn.disabled = false;
    } else {
        confirmBtn.disabled = true;
    }
}

// 注文内容詳細の表示をクリア
function clearOrderDetailsDisplay() {
    // order-details-tableの行が選択されている場合はクリアしない
    const selectedOrderRow = document.querySelector('.order-details-table tbody tr.selected');
    if (selectedOrderRow) {
        return;
    }
    
    // 注文内容入力エリアのstrength-display-rowのspanをクリア
    const designStrengthDisplay = document.querySelector('.order-input-area .strength-display-row span');
    if (designStrengthDisplay) {
        designStrengthDisplay.textContent = '';
    }
    
    // 注文内容入力エリアのunit-display-rowの1つ目のspanをクリア
    const designUnitDisplay = document.querySelector('.order-input-area .unit-display-row span:first-child');
    if (designUnitDisplay) {
        designUnitDisplay.textContent = '';
    }
    
    // 注文内容入力エリアのunit-display-rowの2つ目のspanをクリア
    const designUnitDisplaySecond = document.querySelector('.order-input-area .unit-display-row span:last-child');
    if (designUnitDisplaySecond) {
        designUnitDisplaySecond.textContent = '';
    }
    
    // change-fieldの注文数量をクリア
    const orderQuantitySpan = document.querySelector('#production-instruction-screen .order-info-section .change-field:first-child span');
    if (orderQuantitySpan) {
        orderQuantitySpan.textContent = '';
    }
    
    // 変更1~5をクリア
    const change1Span = document.querySelector('#production-instruction-screen .order-info-section .change-field:nth-child(2) span');
    const change2Span = document.querySelector('#production-instruction-screen .order-info-section .change-field:nth-child(3) span');
    const change3Span = document.querySelector('#production-instruction-screen .order-info-section .change-field:nth-child(4) span');
    const change4Span = document.querySelector('#production-instruction-screen .order-info-section .change-field:nth-child(5) span');
    const change5Span = document.querySelector('#production-instruction-screen .order-info-section .change-field:nth-child(6) span');
    
    if (change1Span) change1Span.textContent = '';
    if (change2Span) change2Span.textContent = '';
    if (change3Span) change3Span.textContent = '';
    if (change4Span) change4Span.textContent = '';
    if (change5Span) change5Span.textContent = '';
    
    // バッチ割の表示をクリア
    const batchDivisionDisplay = document.getElementById('batch-division-display');
    if (batchDivisionDisplay) {
        batchDivisionDisplay.textContent = '';
    }
    
    // アクションボタンの状態を更新
    updateActionButtonsState();
}

// 注文内容詳細が表示されているかチェック
function isOrderDetailsDisplayed() {
    const designStrengthDisplay = document.querySelector('.order-input-area .strength-display-row span');
    const strengthValue = designStrengthDisplay ? designStrengthDisplay.textContent.trim() : '';
    
    // strength-display-rowのspanに値が入っているかチェック
    return strengthValue !== '';
}

// batch-info-tableの状態をチェックする関数
function shouldDisableShipmentButtons() {
    const batchTableWrapper = document.querySelector('#production-instruction-screen .batch-info-table-wrapper');
    if (!batchTableWrapper) {
        return true; // テーブルが見つからない場合は無効化
    }
    
    const batchTable = batchTableWrapper.querySelector('.batch-info-table');
    if (!batchTable) {
        return true; // テーブルが見つからない場合は無効化
    }
    
    const tbody = batchTable.querySelector('tbody');
    if (!tbody) {
        return true; // tbodyが見つからない場合は無効化
    }
    
    const rows = tbody.querySelectorAll('tr');
    
    // データが1つも表示されていない場合
    if (rows.length === 0) {
        return true;
    }
    
    // 全てのデータが「出荷済」かチェック
    let allShipped = true;
    rows.forEach(row => {
        const statusCell = row.querySelector('td:last-child');
        if (statusCell) {
            const status = statusCell.textContent.trim();
            if (status !== '出荷済') {
                allShipped = false;
            }
        }
    });
    
    // 全て出荷済みの場合は無効化
    return allShipped;
}

// selected-requestedクラスが付いた行があるかチェックする関数
function hasSelectedRequestedRow() {
    const selectedRows = document.querySelectorAll('#production-instruction-screen .batch-info-table tbody tr.selected-requested');
    return selectedRows.length > 0;
}

// 変更5に値があるかチェックする関数
function hasChange5Value() {
    const change5Span = document.querySelector('#production-instruction-screen .order-info-section .change-field:nth-child(6) span');
    if (!change5Span) {
        return false;
    }
    const value = change5Span.textContent.trim();
    return value !== '' && !isNaN(parseFloat(value));
}

// アクションボタンの有効/無効を更新
function updateActionButtonsState() {
    const isDisplayed = isOrderDetailsDisplayed();
    const shouldDisableShipment = shouldDisableShipmentButtons();
    const hasSelectedRow = hasSelectedRequestedRow();
    const hasChange5 = hasChange5Value();
    
    // selected-unit-displayで強度が選択されているかチェック
    const unitSelect = document.getElementById('selected-unit-display');
    const isUnitSelected = unitSelect && unitSelect.value && unitSelect.value !== '' && unitSelect.value !== '選択してください';
    
    // 注文ボタン
    const orderQuantityBtn = document.querySelector('.order-quantity-btn');
    if (orderQuantityBtn) {
        // selected-unit-displayで強度が選択されている場合のみ有効
        orderQuantityBtn.disabled = !isUnitSelected;
    }
    
    // 注文数量変更ボタン
    const changeOrderQuantityBtn = document.querySelector('.change-order-quantity-btn');
    if (changeOrderQuantityBtn) {
        // 注文内容詳細が表示されている かつ selected-requestedクラスが付いた行がある かつ 変更5に値がない場合のみ有効
        changeOrderQuantityBtn.disabled = !isDisplayed || !hasSelectedRow || hasChange5;
    }
    
    // 次バッチ 出荷停止ボタン
    const stopShipmentBtn = document.querySelector('.stop-shipment-btn');
    if (stopShipmentBtn) {
        // 注文内容詳細が表示されている かつ batch-info-tableの条件を満たしている場合のみ有効
        stopShipmentBtn.disabled = !isDisplayed || shouldDisableShipment;
    }
    
    // 次バッチ 出荷開始ボタン
    const startShipmentBtn = document.querySelector('.start-shipment-btn');
    if (startShipmentBtn) {
        // 注文内容詳細が表示されている かつ batch-info-tableの条件を満たしている場合のみ有効
        startShipmentBtn.disabled = !isDisplayed || shouldDisableShipment;
    }
}

// 選択確定ボタンのクリック処理
function handleSelectionConfirm() {
    // selected-products-listに1つでもデータがあるかチェック
    const selectedProductsList = document.getElementById('selected-products-list');
    const hasProducts = selectedProductsList && selectedProductsList.children.length > 0;
    
    // selected-unit-displayのvalueが「選択してください」以外かチェック
    const unitSelect = document.getElementById('selected-unit-display');
    const unitValue = unitSelect ? unitSelect.value : '';
    const isUnitSelected = unitValue && unitValue !== '' && unitValue !== '選択してください';
    
    // 条件を満たしている場合のみ処理を実行
    if (hasProducts && isUnitSelected) {
        // selected-strengthの値を取得
        const selectedStrength = document.getElementById('selected-strength');
        const strengthValue = selectedStrength ? selectedStrength.textContent : '';
        
        // 注文内容入力エリアのstrength-display-rowのspanを更新
        const designStrengthDisplay = document.querySelector('.order-input-area .strength-display-row span');
        if (designStrengthDisplay) {
            designStrengthDisplay.textContent = strengthValue;
        }
        
        // 注文内容入力エリアのunit-display-rowの1つ目のspanを更新
        const designUnitDisplay = document.querySelector('.order-input-area .unit-display-row span:first-child');
        if (designUnitDisplay) {
            designUnitDisplay.textContent = unitValue;
        }
        
        // 選択されたunitのmixingNoを取得
        let selectedMixingNo = '';
        if (unitSelect && unitSelect.value) {
            const selectedOption = unitSelect.options[unitSelect.selectedIndex];
            if (selectedOption) {
                selectedMixingNo = selectedOption.getAttribute('data-mixing-no') || '';
            }
        }
        
        // 注文内容入力エリアのunit-display-rowの2つ目のspanを更新
        const designUnitDisplaySecond = document.querySelector('.order-input-area .unit-display-row span:last-child');
        if (designUnitDisplaySecond) {
            designUnitDisplaySecond.textContent = selectedMixingNo;
        }
        
        // 選択された製品の中に打設完了の製品があるかチェック
        const hasCompletedProduct = selectedProducts.some(product => {
            // statusが「打設完了」か、セルにcompletedクラスがあるかチェック
            return product.status === '打設完了' || 
                   (product.cell && product.cell.classList.contains('completed'));
        });
        
        // バッチ割確定データを取得して表示
        const allBatchData = [];
        let hasBatchConfirmationData = false;
        let batchConfirmationOrderQuantity = 0; // 合計を計算するため0で初期化
        let batchConfirmationMethod = null;
        
        // 選択された各製品について、バッチ割確定データを取得
        selectedProducts.forEach(product => {
            const productId = product.id;
            const productUnit = unitValue; // 選択されたunitを使用
            
            // バッチ割確定データテーブルからデータを取得
            if (batchConfirmationData && batchConfirmationData[productId] && batchConfirmationData[productId][productUnit]) {
                hasBatchConfirmationData = true;
                const batchData = batchConfirmationData[productId][productUnit];
                
                // orderQuantityを合計に加算
                if (batchConfirmationData[productId].orderQuantity && batchConfirmationData[productId].orderQuantity[productUnit]) {
                    batchConfirmationOrderQuantity += batchConfirmationData[productId].orderQuantity[productUnit];
                }
                
                // 最初の製品のbatchMethodを取得（全て同じ場合のみ有効）
                if (batchConfirmationMethod === null && batchConfirmationData[productId].batchMethod && batchConfirmationData[productId].batchMethod[productUnit]) {
                    batchConfirmationMethod = batchConfirmationData[productId].batchMethod[productUnit];
                }
                
                // バッチ番号を連番で振り直す（複数製品のデータを結合するため）
                const startNo = allBatchData.length + 1;
                batchData.forEach((batch, index) => {
                    allBatchData.push({
                        no: startNo + index,
                        m3: batch.m3,
                        status: batch.status
                    });
                });
            }
        });
        
        // バッチ割確定データがある場合、注文数量とbatch-radio-buttonを設定
        if (hasBatchConfirmationData) {
            const orderQuantitySpan = document.querySelector('#production-instruction-screen .order-info-section .change-field:first-child span');
            if (orderQuantitySpan && batchConfirmationOrderQuantity > 0) {
                orderQuantitySpan.textContent = batchConfirmationOrderQuantity.toFixed(2);
            }
            
            // batchMethodに基づいてバッチ割を表示
            const batchDivisionDisplay = document.getElementById('batch-division-display');
            if (batchDivisionDisplay && batchConfirmationMethod) {
                batchDivisionDisplay.textContent = batchConfirmationMethod;
            }
        }
        
        // 打設完了の製品を選択した場合のみ、注文数量とbatch-radio-buttonを設定
        if (hasCompletedProduct && !hasBatchConfirmationData) {
            // change-fieldの注文数量にstrength-display-rowの値を表示
            const orderQuantitySpan = document.querySelector('#production-instruction-screen .order-info-section .change-field:first-child span');
            if (orderQuantitySpan) {
                orderQuantitySpan.textContent = strengthValue;
            }
            
            // バッチ割を「おまかせ」と表示
            const batchDivisionDisplay = document.getElementById('batch-division-display');
            if (batchDivisionDisplay) {
                batchDivisionDisplay.textContent = 'おまかせ';
            }
        }
        
        // バッチ割テーブルを更新
        updateBatchAllocationTable(allBatchData);
        
        // アクションボタンの状態を更新
        updateActionButtonsState();
    }
}

// ========================================
// バッチテーブルクリック機能
// ========================================

// バッチテーブルのクリック機能を初期化
function initializeBatchTableClickHandler() {
    console.log('バッチテーブルクリック機能を初期化中...');
    const batchTableWrapper = document.querySelector('#production-instruction-screen .batch-info-table-wrapper');
    if (!batchTableWrapper) {
        console.log('batch-info-table-wrapperが見つかりません');
        return;
    }
    
    const batchTable = batchTableWrapper.querySelector('.batch-info-table');
    if (!batchTable) {
        console.log('batch-info-tableが見つかりません');
        return;
    }
    
    // 依頼中の行にクリック可能なクラスを追加
    const rows = batchTable.querySelectorAll('tbody tr');
    console.log(`見つかった行数: ${rows.length}`);
    
    let clickableCount = 0;
    rows.forEach(row => {
        const statusCell = row.querySelector('.status-requested');
        if (statusCell && statusCell.textContent.trim() === '依頼中') {
            row.classList.add('clickable-requested');
            clickableCount++;
            
            // クリックイベントを追加
            row.addEventListener('click', function() {
                console.log('バッチ行がクリックされました');
                handleBatchRowClick(row);
            });
        }
    });
    
    console.log(`クリック可能な依頼中行数: ${clickableCount}`);
}

// バッチ行のクリック処理
function handleBatchRowClick(row) {
    console.log('バッチ行クリック処理を実行中...');
    
    // クリックされた行が既に選択されているかチェック
    const isSelected = row.classList.contains('selected-requested');
    
    if (isSelected) {
        // 既に選択されている場合は選択を解除
        row.classList.remove('selected-requested');
        console.log('行の選択を解除しました');
    } else {
        // 他の選択された行の選択を解除
        const allRows = document.querySelectorAll('#production-instruction-screen .batch-info-table tbody tr');
        allRows.forEach(r => r.classList.remove('selected-requested'));
        
        // クリックされた行を選択状態にする
        row.classList.add('selected-requested');
        console.log('行の背景を緑色に変更しました');
    }
    
    // アクションボタンの状態を更新
    updateActionButtonsState();
}

// ========================================
// 出荷停止機能
// ========================================

// 出荷停止ボタンのイベント設定
function setupStopShipmentButton() {
    const stopShipmentBtn = document.querySelector('.stop-shipment-btn');
    if (stopShipmentBtn) {
        stopShipmentBtn.addEventListener('click', handleStopShipment);
    }
}

// 出荷停止ボタンのクリック処理
function handleStopShipment() {
    // 確認ダイアログを表示
    if (!confirm('出荷停止依頼を行いますがよろしいですか？')) {
        return;
    }
    
    // batch-info-sectionのbatch-info-table-wrapper内のテーブルを取得
    const batchInfoSection = document.querySelector('#production-instruction-screen .batch-info-section');
    if (!batchInfoSection) {
        console.error('batch-info-sectionが見つかりません');
        return;
    }
    
    const batchInfoTableWrapper = batchInfoSection.querySelector('.batch-info-table-wrapper');
    if (!batchInfoTableWrapper) {
        console.error('batch-info-table-wrapperが見つかりません');
        return;
    }
    
    const batchInfoTable = batchInfoTableWrapper.querySelector('.batch-info-table');
    if (!batchInfoTable) {
        console.error('batch-info-tableが見つかりません');
        return;
    }
    
    // テーブル内のすべての行を取得
    const rows = batchInfoTable.querySelectorAll('tbody tr');
    
    // ステータスが「依頼中」の行を検索して処理
    rows.forEach(row => {
        const statusCell = row.querySelector('td:last-child');
        if (statusCell && statusCell.textContent.trim() === '依頼中') {
            // ステータスを「出荷停止」に変更
            statusCell.textContent = '出荷停止';
            
            // クラスを更新（status-requestedを削除し、status-stoppedを追加）
            statusCell.classList.remove('status-requested');
            statusCell.classList.add('status-stopped');
            
            // 行の背景を黄色に設定
            row.style.backgroundColor = '#ffff00';
            
            // 行のすべてのtdの背景も黄色に設定
            const allCells = row.querySelectorAll('td');
            allCells.forEach(cell => {
                cell.style.backgroundColor = '#ffff00';
            });
        }
    });
    
    // アクションボタンの状態を更新
    updateActionButtonsState();
}

// ========================================
// 出荷開始機能
// ========================================

// 出荷開始ボタンのイベント設定
function setupStartShipmentButton() {
    const startShipmentBtn = document.querySelector('.start-shipment-btn');
    if (startShipmentBtn) {
        startShipmentBtn.addEventListener('click', handleStartShipment);
    }
}

// 出荷開始ボタンのクリック処理
function handleStartShipment() {
    // batch-info-sectionのbatch-info-table-wrapper内のテーブルを取得
    const batchInfoSection = document.querySelector('#production-instruction-screen .batch-info-section');
    if (!batchInfoSection) {
        console.error('batch-info-sectionが見つかりません');
        return;
    }
    
    const batchInfoTableWrapper = batchInfoSection.querySelector('.batch-info-table-wrapper');
    if (!batchInfoTableWrapper) {
        console.error('batch-info-table-wrapperが見つかりません');
        return;
    }
    
    const batchInfoTable = batchInfoTableWrapper.querySelector('.batch-info-table');
    if (!batchInfoTable) {
        console.error('batch-info-tableが見つかりません');
        return;
    }
    
    // テーブル内のすべての行を取得
    const rows = batchInfoTable.querySelectorAll('tbody tr');
    
    // ステータスが「出荷停止」の行を検索
    const stoppedRows = [];
    rows.forEach(row => {
        const statusCell = row.querySelector('td:last-child');
        if (statusCell && statusCell.textContent.trim() === '出荷停止') {
            stoppedRows.push(row);
        }
    });
    
    // 出荷停止の行がない場合は何もしない
    if (stoppedRows.length === 0) {
        return;
    }
    
    // 確認ダイアログを表示
    if (!confirm('出荷開始しますがよろしいですか？')) {
        return;
    }
    
    // ステータスが「出荷停止」の行を処理
    stoppedRows.forEach(row => {
        const statusCell = row.querySelector('td:last-child');
        if (statusCell) {
            // ステータスを「依頼中」に変更
            statusCell.textContent = '依頼中';
            
            // クラスを更新（status-stoppedを削除し、status-requestedを追加）
            statusCell.classList.remove('status-stopped');
            statusCell.classList.add('status-requested');
            
            // 行の背景を白に戻す
            row.style.backgroundColor = '';
            
            // 行のすべてのtdの背景も白に戻す
            const allCells = row.querySelectorAll('td');
            allCells.forEach(cell => {
                cell.style.backgroundColor = '';
            });
        }
    });
    
    // アクションボタンの状態を更新
    updateActionButtonsState();
}

// ========================================
// 打設完了機能
// ========================================

// 打設完了ボタンのイベント設定
function setupCompletionButton() {
    const completionBtn = document.querySelector('#production-instruction-screen .completion-btn');
    if (completionBtn) {
        completionBtn.addEventListener('click', handleCompletion);
    }
}

// 打設完了ボタンのクリック処理
function handleCompletion() {
    // 選択されている製品があるかチェック
    if (selectedProducts.length === 0) {
        alert('製品を選択してください。');
        return;
    }
    
    // モーダルの内容を更新
    updateCompletionModalContent();
    
    // モーダルを開く
    if (typeof showModal === 'function') {
        showModal('completion-modal');
    } else {
        const modal = document.getElementById('completion-modal');
        if (modal) {
            modal.style.display = 'flex';
        }
    }
}

// 打設完了モーダルの内容を更新
function updateCompletionModalContent() {
    if (selectedProducts.length === 0) {
        return;
    }
    
    // 型枠番号を取得（複数あれば複数表示）
    const formworkNumbers = [];
    selectedProducts.forEach(product => {
        if (product.cell) {
            // セルが属するschedule-rowを取得
            const scheduleRow = product.cell.closest('.schedule-row');
            if (scheduleRow) {
                const noLabel = scheduleRow.querySelector('.no-label');
                if (noLabel) {
                    const noLabelText = noLabel.textContent.trim();
                    if (noLabelText && !formworkNumbers.includes(noLabelText)) {
                        formworkNumbers.push(noLabelText);
                    }
                }
            }
        }
    });
    
    // 工事名を取得（最初の製品の工事名を使用）
    let projectName = '';
    if (selectedProducts.length > 0 && selectedProducts[0].cell) {
        const projectSection = selectedProducts[0].cell.closest('.project-section');
        if (projectSection) {
            const projectNameElement = projectSection.querySelector('.project-name');
            if (projectNameElement) {
                projectName = projectNameElement.textContent.trim();
            }
        }
    }
    
    // 製品番号を取得（複数あれば複数表示）
    const productIds = [];
    selectedProducts.forEach(product => {
        if (product.id && !productIds.includes(product.id)) {
            productIds.push(product.id);
        }
    });
    
    // モーダルの各要素を更新
    const formworkSpan = document.querySelector('#completion-modal .completion-info .info-item:first-child span');
    if (formworkSpan) {
        formworkSpan.textContent = formworkNumbers.length > 0 ? formworkNumbers.join(', ') : '-';
    }
    
    const projectSpan = document.querySelector('#completion-modal .completion-info .info-item:nth-child(2) span');
    if (projectSpan) {
        projectSpan.textContent = projectName || '-';
    }
    
    // 階数はそのまま（変更しない）
    
    const productIdSpan = document.querySelector('#completion-modal .completion-info .info-item:last-child span');
    if (productIdSpan) {
        productIdSpan.textContent = productIds.length > 0 ? productIds.join(', ') : '-';
    }
}

// ========================================
// QR読取機能
// ========================================

// QR読取ボタンのイベント設定
function setupProductionQRButton() {
    const qrBtn = document.querySelector('#production-instruction-screen .qr-btn');
    if (qrBtn) {
        qrBtn.addEventListener('click', handleProductionQRButtonClick);
    }
}

// QR読取ボタンのクリック処理
function handleProductionQRButtonClick() {
    // 全てのdate-cellを取得（上から下、左から右の順）
    const allDateCells = document.querySelectorAll('#line-project-sections-container .date-cell');
    
    // 未選択のdate-cellを探す（空白セルと既に選択済みのセルはスキップ）
    // 当日（1列目、data-date-column="1"）のセルのみを対象とする
    for (let i = 0; i < allDateCells.length; i++) {
        const cell = allDateCells[i];
        
        // 空白セルはスキップ
        if (cell.classList.contains('empty')) {
            continue;
        }
        
        // 既に選択済みのセルはスキップ
        if (cell.classList.contains('selected')) {
            continue;
        }
        
        // 当日（1列目）のセルのみを対象とする
        const dateColumn = cell.getAttribute('data-date-column');
        if (dateColumn !== '1') {
            continue;
        }
        
        // 未選択のセルを見つけたら選択処理を実行
        const previousProductCount = selectedProducts.length;
        
        // statusをチェック
        const status = cell.getAttribute('data-status');
        if (status !== '打設前検査完了' && status !== '打設完了') {
            alert('打設前検査完了していない製品は注文できません。');
            return;
        }
        
        // 複数選択の検証
        if (!validateLineMultipleSelection(cell)) {
            return;
        }
        
        // 選択状態を追加
        cell.classList.add('selected');
        addSelectedProduct(cell);
        
        // 選択後の製品数を取得
        const currentProductCount = selectedProducts.length;
        
        // 製品数が変更された場合は注文内容詳細とバッチテーブルをクリア
        if (previousProductCount !== currentProductCount) {
            clearOrderDetailsDisplay();
            updateBatchAllocationTable([]);
            // バッチ割の表示をクリア
            const batchDivisionDisplay = document.getElementById('batch-division-display');
            if (batchDivisionDisplay) {
                batchDivisionDisplay.textContent = '';
            }
        }
        
        // 選択解除ボタンの表示/非表示を更新
        updateClearSelectionButtonVisibilityForProduction();
        
        // 選択製品リストを更新
        updateSelectedProductsList();
        
        // 1つ選択したら終了
        return;
    }
}

// ========================================
// フィルター機能
// ========================================

// フィルターセレクターのイベント設定
function setupProductionFilterSelector() {
    const filterSelector = document.querySelector('#production-instruction-screen .filter-selector');
    if (filterSelector) {
        filterSelector.addEventListener('change', function() {
            filterProductionDateCells(this.value);
        });
    }
}

// date-cellをフィルタリングする関数
function filterProductionDateCells(filterType) {
    const allDateCells = document.querySelectorAll('#line-project-sections-container .date-cell');
    
    allDateCells.forEach(cell => {
        // 空白セルは常に非表示（visibility: hiddenでレイアウトを維持）
        if (cell.classList.contains('empty')) {
            cell.style.visibility = 'hidden';
            cell.style.height = '0';
            cell.style.minHeight = '0';
            cell.style.padding = '0';
            cell.style.border = 'none';
            return;
        }
        
        const status = cell.getAttribute('data-status');
        
        if (filterType === 'all') {
            // 全ての製品を表示
            cell.style.visibility = '';
            cell.style.height = '';
            cell.style.minHeight = '';
            cell.style.padding = '';
            cell.style.border = '';
        } else if (filterType === 'incomplete') {
            // 打設未完了製品のみ表示（data-statusが「打設完了」以外）
            if (status === '打設完了') {
                cell.style.visibility = 'hidden';
                cell.style.height = '0';
                cell.style.minHeight = '0';
                cell.style.padding = '0';
                cell.style.border = 'none';
            } else {
                cell.style.visibility = '';
                cell.style.height = '';
                cell.style.minHeight = '';
                cell.style.padding = '';
                cell.style.border = '';
            }
        } else if (filterType === 'completed') {
            // 打設完了済製品のみ表示（data-statusが「打設完了」）
            if (status === '打設完了') {
                cell.style.visibility = '';
                cell.style.height = '';
                cell.style.minHeight = '';
                cell.style.padding = '';
                cell.style.border = '';
            } else {
                cell.style.visibility = 'hidden';
                cell.style.height = '0';
                cell.style.minHeight = '0';
                cell.style.padding = '0';
                cell.style.border = 'none';
            }
        }
    });
    
    // 親要素（schedule-row）の表示制御
    // 全てのdate-cellが非表示になった行は非表示にする
    const scheduleRows = document.querySelectorAll('#line-project-sections-container .schedule-row');
    scheduleRows.forEach(row => {
        const dateCells = row.querySelectorAll('.date-cell');
        let hasVisibleCell = false;
        
        dateCells.forEach(cell => {
            if (cell.style.visibility !== 'hidden' && !cell.classList.contains('empty')) {
                hasVisibleCell = true;
            }
        });
        
        if (hasVisibleCell) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
    
    // 親要素（project-section）の表示制御
    // 全てのschedule-rowが非表示になったproject-sectionは非表示にする
    const projectSections = document.querySelectorAll('#line-project-sections-container .project-section');
    projectSections.forEach(section => {
        const scheduleRows = section.querySelectorAll('.schedule-row');
        let hasVisibleRow = false;
        
        scheduleRows.forEach(row => {
            if (row.style.display !== 'none') {
                hasVisibleRow = true;
            }
        });
        
        if (hasVisibleRow) {
            section.style.display = '';
        } else {
            section.style.display = 'none';
        }
    });
}

// ========================================
// 注文明細テーブル機能
// ========================================

// 注文明細テーブルのデータを更新する関数
function updateOrderDetailsTable(selectedLine) {
    // lineOrderDetailsDataが定義されているかチェック
    if (typeof lineOrderDetailsData === 'undefined') {
        console.warn('lineOrderDetailsDataが定義されていません');
        return;
    }
    
    // ライン名から工場を特定
    let factory = null;
    if (selectedLine.startsWith('栃木_')) {
        factory = 'tochigi-factory';
    } else if (selectedLine.startsWith('茨城_')) {
        factory = 'ibaraki-factory';
    }
    
    if (!factory || !lineOrderDetailsData[factory]) {
        return;
    }
    
    // 選択されたラインの注文データを取得
    let orders = [];
    if (lineOrderDetailsData[factory][selectedLine]) {
        orders = lineOrderDetailsData[factory][selectedLine];
    }
    
    // 時刻順にソート（HH:MM形式の時刻文字列を分に変換して比較）
    orders.sort((a, b) => {
        const timeToMinutes = (timeStr) => {
            if (!timeStr || timeStr === '') return 0;
            const parts = timeStr.split(':');
            if (parts.length !== 2) return 0;
            const hours = parseInt(parts[0], 10) || 0;
            const minutes = parseInt(parts[1], 10) || 0;
            return hours * 60 + minutes;
        };
        
        const aMinutes = timeToMinutes(a.time);
        const bMinutes = timeToMinutes(b.time);
        return aMinutes - bMinutes;
    });
    
    // テーブルのtbodyを取得
    const tbody = document.querySelector('.order-details-table tbody');
    if (!tbody) {
        return;
    }
    
    // 既存の行をクリア
    tbody.innerHTML = '';
    
    // 注文データに基づいて行を生成
    orders.forEach((order, index) => {
        const row = document.createElement('tr');
        
        // 製品番号を取得（idが存在する場合はidを使用、ない場合は空文字列）
        const productId = order.id || '';
        
        row.innerHTML = `
            <td>${order.time || ''}</td>
            <td>${order.project || ''}</td>
            <td>${productId}</td>
            <td>${order.strength || ''}</td>
        `;
        
        // 行にデータ属性を設定（後で注文詳細を表示するために使用）
        row.setAttribute('data-order-index', index);
        row.setAttribute('data-line', selectedLine);
        
        // クリックイベントを追加
        row.addEventListener('click', function() {
            handleOrderDetailsRowClick(order, selectedLine, row);
        });
        
        tbody.appendChild(row);
    });
}

// 注文明細テーブルの行クリック処理
function handleOrderDetailsRowClick(order, selectedLine, row) {
    // クリックされた行が既に選択されているかチェック
    const isSelected = row.classList.contains('selected');
    
    if (isSelected) {
        // 既に選択されている場合は選択を解除
        row.classList.remove('selected');
        // 注文詳細をクリア
        clearOrderDetailsDisplay();
        // バッチ割テーブルをクリア
        updateBatchAllocationTable([]);
        // バッチ割の表示をクリア
        const batchDivisionDisplay = document.getElementById('batch-division-display');
        if (batchDivisionDisplay) {
            batchDivisionDisplay.textContent = '';
        }
        // アクションボタンの状態を更新
        updateActionButtonsState();
    } else {
        // 他の行の選択を解除
        const allRows = document.querySelectorAll('.order-details-table tbody tr');
        allRows.forEach(r => r.classList.remove('selected'));
        
        // クリックされた行を選択状態にする
        row.classList.add('selected');
        
        // 注文詳細を表示
        displayOrderDetails(order);
    }
}

// 注文詳細をorder-input-areaに表示する関数
function displayOrderDetails(order) {
    if (!order) {
        return;
    }
    
    // まずすべてのフィールドをクリア
    const designStrengthDisplay = document.querySelector('.order-input-area .strength-display-row span');
    if (designStrengthDisplay) {
        designStrengthDisplay.textContent = '';
    }
    
    const designUnitDisplay = document.querySelector('.order-input-area .unit-display-row span:first-child');
    if (designUnitDisplay) {
        designUnitDisplay.textContent = '';
    }
    
    const designMixingNoDisplay = document.querySelector('.order-input-area .unit-display-row span:last-child');
    if (designMixingNoDisplay) {
        designMixingNoDisplay.textContent = '';
    }
    
    const orderQuantitySpan = document.querySelector('#production-instruction-screen .order-info-section .change-field:first-child span');
    if (orderQuantitySpan) {
        orderQuantitySpan.textContent = '';
    }
    
    // 変更1~5をクリア
    const change1Span = document.querySelector('#production-instruction-screen .order-info-section .change-field:nth-child(2) span');
    const change2Span = document.querySelector('#production-instruction-screen .order-info-section .change-field:nth-child(3) span');
    const change3Span = document.querySelector('#production-instruction-screen .order-info-section .change-field:nth-child(4) span');
    const change4Span = document.querySelector('#production-instruction-screen .order-info-section .change-field:nth-child(5) span');
    const change5Span = document.querySelector('#production-instruction-screen .order-info-section .change-field:nth-child(6) span');
    
    if (change1Span) change1Span.textContent = '';
    if (change2Span) change2Span.textContent = '';
    if (change3Span) change3Span.textContent = '';
    if (change4Span) change4Span.textContent = '';
    if (change5Span) change5Span.textContent = '';
    
    const batchDivisionDisplay = document.getElementById('batch-division-display');
    if (batchDivisionDisplay) {
        batchDivisionDisplay.textContent = '';
    }
    
    // バッチ情報テーブルをクリア（直接tbodyをクリア）
    const batchTableWrapper = document.querySelector('#production-instruction-screen .batch-info-table-wrapper');
    if (batchTableWrapper) {
        const batchTable = batchTableWrapper.querySelector('.batch-info-table');
        if (batchTable) {
            const tbody = batchTable.querySelector('tbody');
            if (tbody) {
                tbody.innerHTML = '';
            }
        }
    }
    
    // 次に新しい値を設定
    // 設計数量の表示（strength-display-rowのspan）- m3を表示
    if (designStrengthDisplay) {
        designStrengthDisplay.textContent = order.m3 ? order.m3.toFixed(2) : '';
    }
    
    // 強度の表示（unit-display-rowの1つ目のspan）
    if (designUnitDisplay) {
        designUnitDisplay.textContent = order.strength || '';
    }
    
    // 調合Noの表示（unit-display-rowの2つ目のspan）
    if (designMixingNoDisplay) {
        designMixingNoDisplay.textContent = order.mixNo || '';
    }
    
    // 注文数量の表示
    if (orderQuantitySpan) {
        orderQuantitySpan.textContent = order.volume ? order.volume.toFixed(2) : '';
    }
    
    // バッチ割の表示
    if (batchDivisionDisplay && order.batchRule) {
        batchDivisionDisplay.textContent = order.batchRule;
    }
    
    // バッチ情報テーブルの更新
    if (order.batches && Array.isArray(order.batches) && order.batches.length > 0) {
        const batchDataArray = order.batches.map((batch, index) => ({
            no: index + 1,
            m3: batch.m3 || batch.volume || 0,
            status: batch.status || '依頼中'
        }));
        updateBatchAllocationTable(batchDataArray);
    }
    
    // アクションボタンの状態を更新
    updateActionButtonsState();
}


