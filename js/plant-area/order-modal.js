// ========================================
// 注文追加モーダル機能
// ========================================

// 選択されたデータを追跡する変数
let selectedData = {
    cells: [],
    project: null,
    date: null,
    line: null
};

// 注文追加モーダルの初期化
function initializeOrderModal() {
    setupModalEvents();
}

// モーダルイベントの設定
function setupModalEvents() {
    // キャンセルボタン
    const cancelBtn = document.getElementById('modal-cancel');
    if (cancelBtn) {
        cancelBtn.addEventListener('click', hideOrderModal);
    }
    
    // 確認ボタン
    const confirmBtn = document.getElementById('modal-confirm');
    if (confirmBtn) {
        confirmBtn.addEventListener('click', handleOrderConfirm);
    }
    
    //強度選択の変更イベント
    const mixSelect = document.getElementById('modal-mix');
    if (mixSelect) {
        mixSelect.addEventListener('change', function() {
            updateConcreteQuantity();
            updateOrderConfirmButtonState();
        });
    }
    
    // モーダル外クリックで閉じる
    const modalOverlay = document.getElementById('order-modal');
    if (modalOverlay) {
        modalOverlay.addEventListener('click', function(e) {
            if (e.target === modalOverlay) {
                hideOrderModal();
            }
        });
    }
}

// 注文追加ボタンのクリック処理
function handleAddOrderClick() {
    const addOrderBtn = document.getElementById('add-order-btn');
    // ボタンが無効化されている場合は何もしない
    if (addOrderBtn && addOrderBtn.disabled) {
        return;
    }
    
    const selectedCells = document.querySelectorAll('.date-cell.selected');
    const lightBlueCells = document.querySelectorAll('.date-cell.light-blue-bg');
    
    if (selectedCells.length === 0 && lightBlueCells.length === 0) {
        return;
    }
    
    if (lightBlueCells.length > 0) {
        // データのないセルが選択されている場合は空注文追加モーダルを表示
        const emptySelectedData = collectEmptyCellData(lightBlueCells);
        showEmptyOrderModal(emptySelectedData);
    } else if (selectedCells.length > 0) {
        // データのあるセルが選択されている場合は通常の注文追加モーダルを表示
        collectSelectedData(selectedCells);
        showOrderModal();
    }
}

// 日付をモーダル用にフォーマットする関数
function formatDateForModal(dateText) {
    if (!dateText) return '-';
    
    // 現在の年を取得
    const currentYear = new Date().getFullYear();
    
    // パターン1: "MM/DD 曜日" または "M/D 曜日"
    let match = dateText.match(/(\d{1,2})\/(\d{1,2})\s+\S+/);
    if (match) {
        const month = match[1].padStart(2, '0');
        const day = match[2].padStart(2, '0');
        return `${currentYear}/${month}/${day}`;
    }
    
    // パターン2: "MM/DD" または "M/D"
    match = dateText.match(/(\d{1,2})\/(\d{1,2})/);
    if (match) {
        const month = match[1].padStart(2, '0');
        const day = match[2].padStart(2, '0');
        return `${currentYear}/${month}/${day}`;
    }
    
    // 解析できない場合はそのまま返す
    return dateText;
}

// データのないセルからデータを収集
function collectEmptyCellData(lightBlueCells) {
    const emptySelectedData = {
        cells: Array.from(lightBlueCells),
        project: null,
        date: null,
        line: null,
        formworkNumbers: []
    };
    
    // 最初のセルから基本情報を取得
    const firstCell = lightBlueCells[0];
    
    // プロジェクト名を取得
    const projectSection = firstCell.closest('.project-section');
    if (projectSection) {
        const projectNameElement = projectSection.querySelector('.project-name');
        if (projectNameElement) {
            emptySelectedData.project = projectNameElement.textContent.trim();
        }
    }
    
    // 日付を取得
    const rawDate = getCellDate(firstCell);
    emptySelectedData.date = formatDateForModal(rawDate);
    
    // 各セルからラインと型枠番号を収集
    const formworkNumbers = new Set();
    let lineName = '';
    
    lightBlueCells.forEach(cell => {
        // ライン名を取得（row-labelのline-name）
        const scheduleRow = cell.closest('.schedule-row');
        if (scheduleRow) {
            const lineNameElement = scheduleRow.querySelector('.line-name');
            if (lineNameElement) {
                lineName = lineNameElement.textContent.trim();
            }
            
            // 型枠番号を取得（row-labelのno-label）
            const noLabelElement = scheduleRow.querySelector('.no-label');
            if (noLabelElement) {
                const formworkNumber = noLabelElement.textContent.trim();
                formworkNumbers.add(formworkNumber);
            }
        }
    });
    
    emptySelectedData.line = lineName;
    emptySelectedData.formworkNumbers = Array.from(formworkNumbers);
    
    return emptySelectedData;
}

// 選択されたデータを収集
function collectSelectedData(selectedCells) {
    selectedData.cells = Array.from(selectedCells);
    selectedData.project = null;
    selectedData.date = null;
    selectedData.line = null;
    selectedData.formworkNumbers = [];
    
    // 最初のセルから基本情報を取得
    const firstCell = selectedCells[0];
    
    // プロジェクト名を取得
    const projectSection = firstCell.closest('.project-section');
    if (projectSection) {
        const projectNameElement = projectSection.querySelector('.project-name');
        if (projectNameElement) {
            selectedData.project = projectNameElement.textContent.trim();
        }
    }
    
    // 日付を取得（修正されたgetCellDate関数を使用）
    const rawDate = getCellDate(firstCell);
    selectedData.date = formatDateForModal(rawDate);
    
    // 各セルからラインと型枠番号を収集
    const formworkNumbers = new Set();
    let lineName = '';
    
    selectedCells.forEach(cell => {
        // ライン名を取得（row-labelのline-name）
        const scheduleRow = cell.closest('.schedule-row');
        if (scheduleRow) {
            const lineNameElement = scheduleRow.querySelector('.line-name');
            if (lineNameElement) {
                lineName = lineNameElement.textContent.trim();
            }
            
            // 型枠番号を取得（row-labelのno-label）
            const noLabelElement = scheduleRow.querySelector('.no-label');
            if (noLabelElement) {
                const formworkNumber = noLabelElement.textContent.trim();
                formworkNumbers.add(formworkNumber);
            }
        }
    });
    
    selectedData.line = lineName;
    selectedData.formworkNumbers = Array.from(formworkNumbers);
    
}

// モーダルを表示
function showOrderModal() {
    const modal = document.getElementById('order-modal');
    if (modal) {
        updateModalContent();
        // 注文追加ボタンを初期状態（無効）に設定
        const confirmBtn = document.getElementById('modal-confirm');
        if (confirmBtn) {
            confirmBtn.disabled = true;
        }
        modal.style.display = 'flex';
    }
}

// モーダルを非表示
function hideOrderModal() {
    const modal = document.getElementById('order-modal');
    if (modal) {
        modal.style.display = 'none';
    }
}

// モーダルの内容を更新
function updateModalContent() {
    // 日付
    const dateElement = document.getElementById('modal-date');
    if (dateElement) {
        dateElement.textContent = selectedData.date || '-';
    }
    
    // ライン
    const lineElement = document.getElementById('modal-line');
    if (lineElement) {
        lineElement.textContent = selectedData.line || '-';
    }
    
    // 工事名称
    const projectElement = document.getElementById('modal-project');
    if (projectElement) {
        projectElement.textContent = selectedData.project || '-';
    }
    
    // 型枠番号
    const formworkElement = document.getElementById('modal-formwork');
    if (formworkElement) {
        if (selectedData.formworkNumbers && selectedData.formworkNumbers.length > 0) {
            formworkElement.textContent = selectedData.formworkNumbers.join(', ');
        } else {
            formworkElement.textContent = '-';
        }
    }
    
    // 強度の処理
    updateMixOptions();
    
    // コンクリート量の初期化
    updateConcreteQuantity();
    
    // 注文追加ボタンの状態を更新
    updateOrderConfirmButtonState();
}

//強度オプションの更新
function updateMixOptions() {
    const mixSelect = document.getElementById('modal-mix');
    if (!mixSelect) return;
    
    let mixOptions;
    
    if (selectedData.cells.length === 1) {
        // 1製品選択の場合：その製品のすべての強度を表示
        mixOptions = getSingleProductMixOptions(selectedData.cells[0]);
    } else {
        // 複数製品選択の場合：共通の強度のみを表示
        mixOptions = getCommonMixOptions(selectedData.cells);
    }
    
    // 強度のプルダウンを更新
    updateMixDropdown(mixOptions);
}

// 単一製品の強度オプションを取得（強度と調合Noのペア）
function getSingleProductMixOptions(cell) {
    const mixOptions = [];
    const units = getCellUnits(cell);
    const mixingNos = getCellMixingNos(cell);
    
    // 強度と調合Noのペアを作成
    for (let i = 0; i < units.length; i++) {
        const unit = units[i];
        const mixingNo = mixingNos[i] || '';
        if (unit && unit.trim() !== '') {
            mixOptions.push({
                unit: unit,
                mixingNo: mixingNo
            });
        }
    }
    
    return mixOptions;
}

// 複数製品の共通強度オプションを取得（強度と調合Noが一致しているもののみ）
function getCommonMixOptions(cells) {
    if (cells.length === 0) {
        return [];
    }
    
    // 各セルの強度と調合Noを取得
    const allUnits = [];
    const allMixingNos = [];
    
    cells.forEach(cell => {
        const units = getCellUnits(cell);
        const mixingNos = getCellMixingNos(cell);
        allUnits.push(units);
        allMixingNos.push(mixingNos);
    });
    
    // 共通の強度を取得
    const commonUnits = getCommonUnits(allUnits);
    
    // 共通の強度について、調合Noも一致しているものを取得
    const commonMixingNos = getCommonMixingNos(allMixingNos, allUnits, commonUnits);
    
    // 強度と調合Noのペアを作成
    const mixOptions = [];
    commonUnits.forEach(unit => {
        const mixingNo = commonMixingNos[unit];
        if (mixingNo) {
            mixOptions.push({
                unit: unit,
                mixingNo: mixingNo
                });
            }
        });
        
    return mixOptions;
}


// 強度のプルダウンを更新
function updateMixDropdown(mixOptions) {
    const mixSelect = document.getElementById('modal-mix');
    if (!mixSelect) return;
    
    // 既存のオプションをクリア（最初のオプション以外）
    mixSelect.innerHTML = '<option value="">選択してください</option>';
    
    // 新しいオプションを追加
    mixOptions.forEach(mixOption => {
        const option = document.createElement('option');
        // 強度のみをvalueとtextContentに設定（調合Noは別途取得）
        option.value = mixOption.unit;
        option.textContent = mixOption.unit;
        // 調合Noをdata属性に保存
        option.setAttribute('data-mixing-no', mixOption.mixingNo || '');
        mixSelect.appendChild(option);
    });
    
    // 注文追加ボタンの状態を更新（初期状態は無効）
    updateOrderConfirmButtonState();
}

// コンクリート量を更新
function updateConcreteQuantity() {
    const mixSelect = document.getElementById('modal-mix');
    const concreteElement = document.getElementById('modal-concrete');
    
    if (!mixSelect || !concreteElement) return;
    
    const selectedMix = mixSelect.value;
    if (!selectedMix) {
        concreteElement.textContent = '-';
        return;
    }
    
    // 選択された強度の合計量を計算
    let totalQuantity = 0;
    
    
    selectedData.cells.forEach((cell, cellIndex) => {
        const unitElement = cell.querySelector('.unit');
        const valueElement = cell.querySelector('.value');
        
        if (unitElement && valueElement) {
            const unit = unitElement.textContent.trim();
            const value = valueElement.textContent.trim();
            
            
            if (unit && value) {
                // 強度と値を/で分割
                const units = unit.split('/');
                const values = value.split('/');
                
                
                // 選択された強度に対応する値を探す
                const mixIndex = units.findIndex(u => u.trim() === selectedMix);
                if (mixIndex !== -1 && values[mixIndex]) {
                    const quantity = parseFloat(values[mixIndex].trim());
                    if (!isNaN(quantity)) {
                        totalQuantity += quantity;
                    }
                }
            }
        }
    });
    
    
    if (totalQuantity > 0) {
        concreteElement.textContent = `${totalQuantity.toFixed(2)}m³`;
    } else {
        concreteElement.textContent = '-';
    }
}

// 注文追加ボタンの有効/無効を更新
function updateOrderConfirmButtonState() {
    const mixSelect = document.getElementById('modal-mix');
    const confirmBtn = document.getElementById('modal-confirm');
    
    if (!mixSelect || !confirmBtn) return;
    
    // 強度が選択されているかチェック
    const selectedMix = mixSelect.value;
    confirmBtn.disabled = !selectedMix || selectedMix === '';
}

// 注文確定の処理
function handleOrderConfirm() {
    const mixSelect = document.getElementById('modal-mix');
    const selectedMix = mixSelect ? mixSelect.value : '';
    
    // 強度が選択されているかチェック
    if (!selectedMix) {
        alert('強度を選択してください');
        return;
    }
    
    // 確認ダイアログを表示
    if (!confirm('注文を追加します。よろしいですか？')) {
        return;
    }
    
    // 注文データを作成
    const orderDataObj = createOrderData(selectedMix);
    
    // 注文明細に追加
    addOrderToTable(orderDataObj);
    
    // モーダルを閉じる
    hideOrderModal();
    
    // 選択をクリア
    clearSelection();
}

// 注文データを作成する関数
function createOrderData(selectedMix) {
    const currentTime = new Date();
    const timeString = formatTime(currentTime);
    
    // 注文Noを取得（最大注文No + 1）
    const nextOrderNo = getNextOrderNo();
    
    // コンクリート量を取得（単位付き）
    const concreteQuantity = document.getElementById('modal-concrete').textContent;
    const formattedM3 = formatM3Value(concreteQuantity);
    
    // 型枠番号を取得（複数の場合は半角スペースで表示）
    const formworkNumbers = selectedData.formworkNumbers || [];
    const formworkDisplay = formworkNumbers.length > 0 ? formworkNumbers.join(' ') : '';
    
    // 調合Noを取得（選択された強度に対応する調合No）
    const mixSelect = document.getElementById('modal-mix');
    let mixNo = '';
    if (mixSelect && mixSelect.value === selectedMix) {
        const selectedOption = mixSelect.options[mixSelect.selectedIndex];
        if (selectedOption) {
            mixNo = selectedOption.getAttribute('data-mixing-no') || '';
        }
    }
    
    return {
        time: timeString,
        line: selectedData.line,
        project: selectedData.project,
        orderNo: nextOrderNo,
        unloadingNo: '', // 空欄
        formworkNo: formworkDisplay, // 型枠番号（複数時は半角スペース）
        strength: selectedMix, // 強度
        mixNo: mixNo, // 調合No
        m3: formattedM3, // ㎥（単位付き、適切な小数点表示）
        batcher: '第2', // バッチャー
        batchStatus: 'バッチ割', // バッチ割
        mixingQuantity: '0㎥' // 練混数量
    };
}

// 時刻をフォーマットする関数
function formatTime(date) {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
}

// ㎥の数値を適切な小数点表示でフォーマットする関数
function formatM3Value(concreteQuantity) {
    if (!concreteQuantity || concreteQuantity === '-') {
        return '-';
    }
    
    // m³を除去して数値部分を取得
    const numericValue = concreteQuantity.replace('m³', '').trim();
    const value = parseFloat(numericValue);
    
    if (isNaN(value)) {
        return concreteQuantity; // 数値でない場合はそのまま返す
    }
    
    // 小数点第1位まで表示し、小数点第1位以下に0以外の数字がある場合はそれも表示
    const rounded = Math.round(value * 10) / 10; // 小数点第1位で四捨五入
    const hasSignificantDecimals = (value * 10) % 1 !== 0; // 小数点第1位以下に0以外の数字があるか
    
    if (hasSignificantDecimals) {
        // 小数点第1位以下に0以外の数字がある場合は、その桁数まで表示
        const decimalPlaces = getDecimalPlaces(value);
        return `${value.toFixed(decimalPlaces)}㎥`;
    } else {
        // 小数点第1位以下が0の場合は、小数点第1位まで表示
        return `${rounded.toFixed(1)}㎥`;
    }
}

// 小数点以下の有効桁数を取得する関数
function getDecimalPlaces(num) {
    const str = num.toString();
    if (str.indexOf('.') === -1) {
        return 1; // 整数の場合は小数点第1位まで
    }
    const decimalPart = str.split('.')[1];
    return Math.max(1, decimalPart.length); // 最低1桁、最大は元の桁数
}

// 次の注文Noを取得する関数
function getNextOrderNo() {
    const orderTable = document.querySelector('.order-table tbody');
    if (!orderTable) return '1';
    
    const rows = orderTable.querySelectorAll('tr');
    let maxOrderNo = 0;
    
    rows.forEach(row => {
        const orderNoCell = row.querySelector('td:nth-child(4)'); // 注文No列
        if (orderNoCell) {
            const orderNo = parseInt(orderNoCell.textContent.trim());
            if (!isNaN(orderNo) && orderNo > maxOrderNo) {
                maxOrderNo = orderNo;
            }
        }
    });
    
    return (maxOrderNo + 1).toString();
}

// 現在選択されている工場を取得する関数
function getCurrentFactory() {
    const factorySelect = document.querySelector('.factory-selector');
    return factorySelect ? factorySelect.value : 'tochigi-factory';
}

// 新しく追加された行にイベントリスナーを設定する関数
function setupNewRowEvents(row) {
    // バッチステータスのイベント設定
    const batchStatus = row.querySelector('.batch-status');
    if (batchStatus) {
        batchStatus.addEventListener('click', function() {
            if (typeof handleBatchStatusClick === 'function') {
                handleBatchStatusClick(this);
            }
        });
    }
    
    // バッチャーセレクトのイベント設定
    const batcherSelect = row.querySelector('.batcher-select');
    if (batcherSelect) {
        batcherSelect.addEventListener('change', function() {
            // 必要に応じて追加の処理を実装
        });
    }
}

// 注文明細テーブルに注文を追加する関数
function addOrderToTable(orderDataObj) {
    const orderTable = document.querySelector('.order-table tbody');
    if (!orderTable) return;
    
    // orderDataにも追加する
    addOrderToOrderData(orderDataObj);
    
    // 新しい行を作成
    const newRow = document.createElement('tr');
    // 新しく追加される注文は常にpending状態なのでクラスを追加
    newRow.classList.add('batch-status-pending');
    // ㎥数と練混数量を小数点第2位まで表示するためのフォーマット関数
    const formatM3Display = (value) => {
        if (!value || value === '-') return '-';
        // 数値部分を抽出（㎥やm³などの単位を除去）
        const numericValue = parseFloat(value.toString().replace(/[㎥m³]/g, '').trim());
        if (isNaN(numericValue)) return value;
        return `${numericValue.toFixed(2)}㎥`;
    };
    
    // 新しく追加される注文は常に削除可能（バッチ割が「バッチ割」状態）
    newRow.innerHTML = `
        <td class="pending-time">${orderDataObj.time}</td>
        <td>${orderDataObj.line}</td>
        <td>${orderDataObj.project}</td>
        <td>${orderDataObj.orderNo}</td>
        <td>${orderDataObj.unloadingNo ? `<span class="unloading-number">${orderDataObj.unloadingNo}</span>` : ''}</td>
        <td>${orderDataObj.formworkNo}</td>
        <td>${orderDataObj.strength}</td>
        <td>${orderDataObj.mixNo}</td>
        <td>${formatM3Display(orderDataObj.m3)}</td>
        <td>
            ${getCurrentFactory() === 'ibaraki-factory' ? '' : `
            <select class="batcher-select">
                <option value="第2" selected>第2</option>
                <option value="第3">第3</option>
            </select>
            `}
        </td>
        <td>
            <span class="batch-status pending">${orderDataObj.batchStatus}</span>
        </td>
        <td>${formatM3Display(orderDataObj.mixingQuantity)}</td>
        <td><button class="delete-btn" onclick="showDeleteOrderModal(this)">削除</button></td>
    `;
    
    // 時刻でソートして挿入
    insertRowInTimeOrder(orderTable, newRow, orderDataObj.time);
    
    // 新しく追加された行にイベントリスナーを設定
    setupNewRowEvents(newRow);
}

// orderDataに注文を追加する関数
function addOrderToOrderData(orderDataObj) {
    try {
        const factoryValue = getCurrentFactory();
        
        if (typeof orderData === 'undefined' || !orderData[factoryValue]) {
            console.warn('orderDataが見つかりません');
            return;
        }
        
        const factoryData = orderData[factoryValue];
        const line = orderDataObj.line;
        
        // ラインが存在しない場合は作成
        if (!factoryData[line]) {
            factoryData[line] = [];
        }
        
        // volumeを数値に変換（m3から数値部分を抽出）
        let volume = 0;
        if (orderDataObj.m3 && orderDataObj.m3 !== '-') {
            const numericValue = parseFloat(orderDataObj.m3.toString().replace(/[㎥m³]/g, '').trim());
            if (!isNaN(numericValue)) {
                volume = numericValue;
            }
        }
        
        // wetQuantityを数値に変換
        let wetQuantity = 0;
        if (orderDataObj.mixingQuantity && orderDataObj.mixingQuantity !== '-') {
            const numericValue = parseFloat(orderDataObj.mixingQuantity.toString().replace(/[㎥m³]/g, '').trim());
            if (!isNaN(numericValue)) {
                wetQuantity = numericValue;
            }
        }
        
        // orderDataの構造に合わせたオブジェクトを作成
        const orderEntry = {
            id: `NEW_${Date.now()}_${orderDataObj.orderNo}`, // 一意のIDを生成
            time: orderDataObj.time,
            line: orderDataObj.line,
            project: orderDataObj.project,
            orderNo: orderDataObj.orderNo,
            unloadingNo: orderDataObj.unloadingNo || '',
            formworkNo: orderDataObj.formworkNo || '',
            strength: orderDataObj.strength,
            mixNo: orderDataObj.mixNo || '',
            volume: volume,
            batcher: orderDataObj.batcher || '第2',
            batchStatus: 'pending', // orderDataでは'pending'を使用
            batchRule: 'おまかせ', // デフォルト値
            message: '',
            wetQuantity: wetQuantity
        };
        
        // orderDataに追加
        factoryData[line].push(orderEntry);
    } catch (error) {
        console.error('orderDataへの追加でエラーが発生しました:', error);
    }
}

// 時刻順で行を挿入する関数
function insertRowInTimeOrder(table, newRow, newTime) {
    const rows = Array.from(table.querySelectorAll('tr'));
    const newTimeMinutes = timeToMinutes(newTime);
    
    let insertIndex = rows.length;
    
    for (let i = 0; i < rows.length; i++) {
        const timeCell = rows[i].querySelector('td:first-child');
        if (timeCell) {
            const existingTime = timeCell.textContent.trim();
            const existingTimeMinutes = timeToMinutes(existingTime);
            
            if (newTimeMinutes < existingTimeMinutes) {
                insertIndex = i;
                break;
            }
        }
    }
    
    if (insertIndex === rows.length) {
        table.appendChild(newRow);
    } else {
        table.insertBefore(newRow, rows[insertIndex]);
    }
}

// 時刻を分に変換する関数
function timeToMinutes(timeString) {
    const [hours, minutes] = timeString.split(':').map(Number);
    return hours * 60 + minutes;
}

// 選択をクリア
function clearSelection() {
    // 選択されたセルをクリア
    selectedData.cells.forEach(cell => {
        cell.classList.remove('selected');
    });
    selectedData.cells = [];
    
    // 水色背景のセルもクリア
    const lightBlueCells = document.querySelectorAll('.date-cell.light-blue-bg');
    lightBlueCells.forEach(cell => {
        cell.classList.remove('light-blue-bg');
    });
    
    updateClearSelectionButtonVisibility();
}

// 選択解除ボタンの表示を更新
function updateClearSelectionButtonVisibility() {
    const clearBtn = document.querySelector('.clear-selection-btn');
    const selectedCells = document.querySelectorAll('.date-cell.selected');
    
    if (clearBtn) {
        if (selectedCells.length > 0) {
            clearBtn.style.display = 'block';
        } else {
            clearBtn.style.display = 'none';
        }
    }
}

