// ========================================
// 日付セルクリック処理
// ========================================

// date-cellのクリックイベントハンドラーを設定する関数
function setupDateCellClickHandlers() {
    // 既存のイベントリスナーを削除
    removeExistingDateCellListeners();
    
    // 新しいイベントリスナーを追加
    addDateCellListeners();
}

// 既存の日付セルイベントリスナーを削除
function removeExistingDateCellListeners() {
    const existingCells = document.querySelectorAll('.date-cell');
    existingCells.forEach(cell => {
        cell.removeEventListener('click', handleDateCellClick);
    });
}

// 日付セルにイベントリスナーを追加
function addDateCellListeners() {
    const dateCells = document.querySelectorAll('.date-cell');
    dateCells.forEach(cell => {
        cell.addEventListener('click', handleDateCellClick);
    });
}

// date-cellのクリック処理
function handleDateCellClick(event) {
    const cell = event.currentTarget;
    const hasData = checkIfCellHasData(cell);
    
    if (hasData) {
        handleDataCellClick(cell);
    } else {
        handleEmptyCellClick(cell);
    }
}

// セルにデータがあるかチェック
function checkIfCellHasData(cell) {
    return !cell.classList.contains('empty') && cell.innerHTML.trim() !== '';
}

// データのあるセルのクリック処理
function handleDataCellClick(cell) {
    // 水色背景をすべて解除
    clearAllLightBlueBackgrounds();
    
    if (cell.classList.contains('selected')) {
        // 既に選択されている場合は選択を解除
        cell.classList.remove('selected');
    } else {
        // ステータスをチェックして確認メッセージを表示
        const status = getCellStatus(cell);
        if (status && status !== '打設前検査完了' && status !== '打設完了') {
            // 確認メッセージを表示
            const message = `この製品のステータスは打設前検査完了に達していませんが、注文を行いますか？`;
            if (!confirm(message)) {
                // キャンセルが押された場合は選択しない
                return;
            }
        }
        
        // 複数選択の検証
        if (!validateMultipleSelection(cell)) {
            return;
        }
        // クリックされたセルを選択
        cell.classList.add('selected');
    }
    
    // 選択解除ボタンの表示/非表示を更新
    updateClearSelectionButtonVisibility();
    
    // 注文追加ボタンの状態を更新
    if (typeof updateAddOrderButtonState === 'function') {
        updateAddOrderButtonState();
    }
}

// セルからステータスを取得する関数
function getCellStatus(cell) {
    // data-status属性から取得を試みる
    const dataStatus = cell.getAttribute('data-status');
    if (dataStatus) {
        return dataStatus;
    }
    
    // .status要素から取得
    const statusElement = cell.querySelector('.status');
    if (statusElement) {
        return statusElement.textContent.trim();
    }
    
    return null;
}

// データのないセルのクリック処理
function handleEmptyCellClick(cell) {
    // selectedになっているセルがある場合は処理を中断
    const selectedCells = document.querySelectorAll('.date-cell.selected');
    if (selectedCells.length > 0) {
        return;
    }
    
    if (cell.classList.contains('light-blue-bg')) {
        // 既に水色背景の場合は背景をやめる
        cell.classList.remove('light-blue-bg');
    } else {
        // 他の水色背景を解除して、クリックされたセルを水色にする
        clearAllLightBlueBackgrounds();
        cell.classList.add('light-blue-bg');
    }
    
    // 選択解除ボタンの表示/非表示を更新
    updateClearSelectionButtonVisibility();
    
    // 注文追加ボタンの状態を更新
    if (typeof updateAddOrderButtonState === 'function') {
        updateAddOrderButtonState();
    }
}

// すべての水色背景を解除
function clearAllLightBlueBackgrounds() {
    const lightBlueCells = document.querySelectorAll('.date-cell.light-blue-bg');
    lightBlueCells.forEach(lightBlueCell => {
        lightBlueCell.classList.remove('light-blue-bg');
    });
}

// 複数選択の検証
function validateMultipleSelection(cell) {
    const selectedCells = document.querySelectorAll('.date-cell.selected');
    if (selectedCells.length > 0) {
        // 工事名と強度を比較
        const comparisonResult = canSelectMultipleCells(selectedCells, cell);
        if (!comparisonResult.allowed) {
            // エラー表示
            alert(comparisonResult.errorMessage);
            return false;
        }
    }
    return true;
}

// ========================================
// 選択解除ボタン制御
// ========================================

// 選択解除ボタンの制御機能を設定する関数
function setupClearSelectionButton() {
    const clearSelectionBtn = document.querySelector('.clear-selection-btn');
    if (!clearSelectionBtn) return;
    
    // 選択解除ボタンのクリックイベント
    clearSelectionBtn.addEventListener('click', clearAllSelections);
}

// すべての選択を解除する関数
function clearAllSelections() {
    clearSelectedCells();
    clearLightBlueCells();
    updateClearSelectionButtonVisibility();
    
    // 注文追加ボタンの状態を更新
    if (typeof updateAddOrderButtonState === 'function') {
        updateAddOrderButtonState();
    }
}

// 選択されたセルをクリア
function clearSelectedCells() {
    const selectedCells = document.querySelectorAll('.date-cell.selected');
    selectedCells.forEach(cell => {
        cell.classList.remove('selected');
    });
}

// 水色背景のセルをクリア
function clearLightBlueCells() {
    const lightBlueCells = document.querySelectorAll('.date-cell.light-blue-bg');
    lightBlueCells.forEach(cell => {
        cell.classList.remove('light-blue-bg');
    });
}

// 選択解除ボタンの表示/非表示を更新する関数
function updateClearSelectionButtonVisibility() {
    const clearSelectionBtn = document.querySelector('.clear-selection-btn');
    const addOrderForm = document.querySelector('.add-order-form');
    if (!clearSelectionBtn || !addOrderForm) return;
    
    const hasSelections = checkForActiveSelections();
    
    if (hasSelections) {
        showClearSelectionButton(clearSelectionBtn, addOrderForm);
    } else {
        hideClearSelectionButton(clearSelectionBtn, addOrderForm);
    }
}

// アクティブな選択があるかチェック
function checkForActiveSelections() {
    const hasSelectedCells = document.querySelectorAll('.date-cell.selected').length > 0;
    const hasLightBlueCells = document.querySelectorAll('.date-cell.light-blue-bg').length > 0;
    return hasSelectedCells || hasLightBlueCells;
}

// 選択解除ボタンを表示
function showClearSelectionButton(clearSelectionBtn, addOrderForm) {
    clearSelectionBtn.style.display = 'block';
    addOrderForm.classList.add('has-clear-btn');
}

// 選択解除ボタンを非表示
function hideClearSelectionButton(clearSelectionBtn, addOrderForm) {
    clearSelectionBtn.style.display = 'none';
    addOrderForm.classList.remove('has-clear-btn');
}
