// ========================================
// 注文テーブル関連処理
// ========================================

// 注文明細テーブルの初期化関数
function initializeOrderTable() {
    try {
        setupBatcherSelectEvents();
        setupBatchStatusEvents();
        setupTableRowSelectionEvents();
    } catch (error) {
        console.error('注文テーブルの初期化でエラーが発生しました:', error);
    }
}

// バッチャーセレクトのイベント設定
function setupBatcherSelectEvents() {
    const batcherSelects = document.querySelectorAll('.batcher-select');
    batcherSelects.forEach(select => {
        select.addEventListener('change', function() {
            // ここでバッチャー変更の処理を追加できます
        });
    });
}

// バッチ割ステータスのイベント設定
function setupBatchStatusEvents() {
    const batchStatuses = document.querySelectorAll('.batch-status');
    batchStatuses.forEach(status => {
        status.addEventListener('click', function() {
            handleBatchStatusClick(this);
        });
    });
}

// テーブル行選択のイベント設定
function setupTableRowSelectionEvents() {
    const tableRows = document.querySelectorAll('.order-table tbody tr');
    tableRows.forEach((row, index) => {
        row.addEventListener('click', handleRowClick);
    });
}

// 行クリックのハンドラー関数
function handleRowClick(e) {
    // 茨城工場選択時のみ行選択を有効化
    const factorySelector = document.querySelector('.factory-selector');
    if (!factorySelector || factorySelector.value !== 'ibaraki-factory') {
        return;
    }
    
    // バッチ割ボタンや削除ボタンをクリックした場合は処理しない
    if (e.target.closest('.batch-status') || e.target.closest('.delete-btn')) {
        return;
    }
    
    // クリックされた行を取得
    const row = e.target.closest('tr');
    if (!row) {
        return;
    }
    
    // 既に選択されている行かチェック
    const isSelected = row.classList.contains('selected');
    
    // 選択解除される場合は、先に注文情報を取得（選択解除前に取得する必要がある）
    let previousOrderInfo = null;
    if (isSelected && typeof extractOrderInfoFromRow === 'function') {
        try {
            previousOrderInfo = extractOrderInfoFromRow(row);
        } catch (error) {
            console.warn('extractOrderInfoFromRowでエラーが発生しました:', error);
        }
    }
    
    // 全ての行の選択を解除
    clearRowSelection();
    
    // batch-schedule-tableで選択されているセルがあれば、そのセルの選択状態を解除
    const selectedBatchScheduleCells = document.querySelectorAll('#batch-schedule-tbody .clickable-cell.selected');
    selectedBatchScheduleCells.forEach(cell => {
        cell.classList.remove('selected');
    });
    
    // クリックされた行が選択されていなかった場合は選択状態にする
    if (!isSelected) {
        row.classList.add('selected');
        
        // 選択された行の注文情報を取得
        let selectedOrderInfo = null;
        if (typeof extractOrderInfoFromRow === 'function') {
            try {
                selectedOrderInfo = extractOrderInfoFromRow(row);
            } catch (error) {
                console.warn('extractOrderInfoFromRowでエラーが発生しました:', error);
            }
        }
        
        // 行のbatchStatusを取得（行のクラスまたはbatch-status要素のクラスから判断）
        const batchStatusElement = row.querySelector('.batch-status');
        const isPending = row.classList.contains('batch-status-pending') || 
                         (batchStatusElement && batchStatusElement.classList.contains('pending'));
        const isCompleted = batchStatusElement && batchStatusElement.classList.contains('completed');
        
        // batchStatusがpendingの場合の処理
        if (isPending && selectedOrderInfo) {
            // batch-status要素をactiveにする
            if (batchStatusElement) {
                setBatchStatusActive(batchStatusElement);
            }
            // handleBatchStatusClickの処理を実行（showBatchDivisionModalを呼び出す）
            if (typeof showBatchDivisionModal === 'function') {
                showBatchDivisionModal(selectedOrderInfo);
                currentDisplayedOrder = selectedOrderInfo;
                // バッチリストをリセット
                if (typeof clearBatchList === 'function') {
                    clearBatchList();
                }
            }
        }
        
        // batchStatusがcompletedの場合の処理
        if (isCompleted) {
            // 全てのbatch-statusのactive状態を解除
            clearBatchStatusActive();
            // バッチ分割表示を初期化
            if (typeof clearBatchDivisionDisplay === 'function') {
                clearBatchDivisionDisplay();
                currentDisplayedOrder = null;
            }
        }
        
        // デバッグ用ログ（Aラインの問題を調査）
        if (selectedOrderInfo && selectedOrderInfo.line && selectedOrderInfo.line.includes('Aライン')) {
            console.log('handleRowClick - Aライン:', {
                selectedOrderInfoLine: selectedOrderInfo.line,
                orderNo: selectedOrderInfo.orderNo,
                project: selectedOrderInfo.project
            });
        }
        
        // 選択された行のラインに対応する列のみを更新
        if (selectedOrderInfo && selectedOrderInfo.line && typeof generateBatchScheduleData === 'function') {
            // 選択した行の情報を保存（generateBatchScheduleData後に復元するため）
            const selectedOrderNo = selectedOrderInfo.orderNo;
            const selectedLine = selectedOrderInfo.line;
            const selectedProject = selectedOrderInfo.project;
            
            generateBatchScheduleData(selectedOrderInfo.line);
            
            // generateBatchScheduleData後に選択状態を復元
            // 少し遅延を入れて、DOM更新が完了してから選択状態を復元
            setTimeout(() => {
                if (typeof selectOrderTableRowByOrderInfo === 'function') {
                    selectOrderTableRowByOrderInfo(selectedOrderNo, selectedLine, selectedProject);
                }
            }, 0);
        }
    } else {
        // 選択解除された場合は、lineDisplayedOrderMapに保存されている注文をそのまま表示し続ける
        // 何も処理しない（lineDisplayedOrderMapの状態を維持）
    }
}

// 現在表示されている注文情報を追跡する変数
let currentDisplayedOrder = null;

// バッチ割ステータスのクリック処理関数
function handleBatchStatusClick(element) {
    const currentStatus = element.textContent.trim();
    
    if (currentStatus === '済') {
        // 済の場合は何も起こらない
        return;
    } else if (currentStatus === 'バッチ割') {
        // バッチ割の場合は処理を流す
        const row = element.closest('tr');
        const orderInfo = extractOrderInfoFromRow(row);
        
        if (!orderInfo) {
            return;
        }
        
        // 同じ注文が既に表示されているかチェック
        if (currentDisplayedOrder && 
            currentDisplayedOrder.orderNo === orderInfo.orderNo && 
            currentDisplayedOrder.line === orderInfo.line) {
            // 同じ注文の場合は表示を消す
            clearBatchDivisionDisplay();
            currentDisplayedOrder = null;
            // 行の選択状態を解除
            clearRowSelection();
            // バッチ割ボタンのアクティブ状態を解除
            clearBatchStatusActive();
        } else {
            // 異なる注文の場合は表示を更新
            if (typeof showBatchDivisionModal === 'function') {
                showBatchDivisionModal(orderInfo);
                currentDisplayedOrder = orderInfo;
                // バッチ割ボタンをアクティブにする
                setBatchStatusActive(element);
                // バッチリストをリセット
                if (typeof clearBatchList === 'function') {
                    clearBatchList();
                }
            }
        }
    } else if (currentStatus === '変更') {
        // 変更の場合は処理を流す（後で実装予定）
        // TODO: 変更の処理を実装
    }
}


// 行から注文情報を抽出する関数
function extractOrderInfoFromRow(row) {
    try {
        const cells = row.querySelectorAll('td');
        
        if (cells.length < 12) {
            return null;
        }
        
        const orderNo = cells[3].textContent.trim();
        const line = cells[1].textContent.trim();
        
        // orderDataオブジェクトの存在確認
        if (typeof orderData === 'undefined') {
            console.error('orderDataオブジェクトが定義されていません');
            return null;
        }
        
        // バッチャーセレクトの値を安全に取得
        let batcherValue = '';
        const batcherSelect = cells[9].querySelector('select');
        if (batcherSelect) {
            batcherValue = batcherSelect.value;
        } else {
            batcherValue = '';
        }
        
        const orderInfo = {
            time: cells[0].textContent.trim(),
            line: line,
            project: cells[2].textContent.trim(),
            orderNo: orderNo,
            unloadingNo: cells[4].textContent.trim(),
            formworkNo: cells[5].textContent.trim(),
            strength: cells[6].textContent.trim(),
            mixNo: cells[7].textContent.trim(),
            volume: cells[8].textContent.trim(),
            batcher: batcherValue,
            batchRule: '-',
            message: '-',
            wetQuantity: cells[11].textContent.trim()
        };
        
        return orderInfo;
    } catch (error) {
        console.error('extractOrderInfoFromRow関数でエラーが発生しました:', error);
        return null;
    }
}



// 注文テーブルのデータを更新する関数
function updateOrderTableData(factoryValue) {
    
    // 工場のみで注文データを取得（ラインでの絞り込みは行わない）
    let orders = [];
    if (orderData[factoryValue]) {
        // 工場内のすべてのラインの注文データを結合
        Object.values(orderData[factoryValue]).forEach(lineOrders => {
            orders = orders.concat(lineOrders);
        });
    }
    
    // バッチャーフィルタリング（栃木工場の場合のみ）
    if (factoryValue === 'tochigi-factory') {
        const batcherFilterSelector = document.getElementById('batcher-filter-selector');
        if (batcherFilterSelector && batcherFilterSelector.style.display !== 'none') {
            const selectedBatcher = batcherFilterSelector.value;
            if (selectedBatcher !== 'all') {
                orders = orders.filter(order => order.batcher === selectedBatcher);
            }
        }
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
    const tbody = document.querySelector('.order-table tbody');
    if (!tbody) {
        return;
    }
    
    // 既存の行をクリア
    tbody.innerHTML = '';
    
    // 注文データに基づいて行を生成
    orders.forEach(order => {
        const row = document.createElement('tr');
        
        // バッチステータスの表示テキストとクラスを決定
        let statusText, statusClass;
        switch(order.batchStatus) {
            case 'completed':
                statusText = '済';
                statusClass = 'completed';
                break;
            case 'change':
                statusText = '変更';
                statusClass = 'change';
                break;
            case 'pending':
                statusText = 'バッチ割';
                statusClass = 'pending';
                break;
            default:
                statusText = 'バッチ割';
                statusClass = 'pending';
        }
        
        // batchStatusがpendingの場合は行にクラスを追加
        if (order.batchStatus === 'pending' || (!order.batchStatus && statusClass === 'pending')) {
            row.classList.add('batch-status-pending');
        }
        
        // 茨城工場かつbatchStatusがpendingの場合、batch-status要素にdisabledクラスを追加
        const isIbarakiPending = factoryValue === 'ibaraki-factory' && 
                                 (order.batchStatus === 'pending' || (!order.batchStatus && statusClass === 'pending'));
        const batchStatusDisabledClass = isIbarakiPending ? ' disabled' : '';
        
        // 削除ボタンの状態を決定（バッチ割が済でも削除可能）
        const deleteButtonHtml = '<button class="delete-btn" onclick="showDeleteOrderModal(this)">削除</button>';
        
        row.innerHTML = `
            <td class="${order.batchStatus === 'pending' || (!order.batchStatus && statusClass === 'pending') ? 'pending-time' : ''}">${order.time}</td>
            <td>${order.line}</td>
            <td>${order.project}</td>
            <td>${order.orderNo}</td>
            <td>${order.unloadingNo ? `<span class="unloading-number">${order.unloadingNo}</span>` : ''}</td>
            <td>${order.formworkNo}</td>
            <td>${order.strength}</td>
            <td>${order.mixNo}</td>
            <td>${parseFloat(order.volume).toFixed(2)}㎥</td>
            <td>
                ${factoryValue === 'ibaraki-factory' ? '' : `
                <select class="batcher-select">
                    <option value="第2" ${order.batcher === '第2' ? 'selected' : ''}>第2</option>
                    <option value="第3" ${order.batcher === '第3' ? 'selected' : ''}>第3</option>
                </select>
                `}
            </td>
            <td><span class="batch-status ${statusClass}${batchStatusDisabledClass}">${statusText}</span></td>
            <td>${parseFloat(order.wetQuantity).toFixed(2)}㎥</td>
            <td>${deleteButtonHtml}</td>
        `;
        
        tbody.appendChild(row);
    });
    
    // イベントリスナーを再設定
    setupBatcherSelectEvents();
    
    // バッチ割ボタンのクリックイベントを設定
    setupBatchStatusClickEvents();
    
    // テーブル行のクリックイベントを再設定
    setupTableRowSelectionEvents();
}

// バッチ割ボタンのクリックイベントを設定する関数
function setupBatchStatusClickEvents() {
    const batchStatusElements = document.querySelectorAll('.batch-status');
    batchStatusElements.forEach(element => {
        // disabledクラスが付いている場合はイベントリスナーを設定しない
        if (element.classList.contains('disabled')) {
            return;
        }
        // 既存のイベントリスナーを削除
        element.removeEventListener('click', handleBatchStatusClickEvent);
        // 新しいイベントリスナーを追加
        element.addEventListener('click', handleBatchStatusClickEvent);
    });
}

// バッチ割ボタンクリックイベントハンドラー
function handleBatchStatusClickEvent(event) {
    event.stopPropagation();
    // 茨城工場でdisabledクラスが付いている場合は処理しない
    if (event.target.classList.contains('disabled')) {
        return;
    }
    handleBatchStatusClick(event.target);
}

// 行の選択状態をクリアする関数
function clearRowSelection() {
    const allRows = document.querySelectorAll('.order-table tbody tr');
    allRows.forEach(row => row.classList.remove('selected'));
}

// バッチ割ボタンのアクティブ状態をクリアする関数
function clearBatchStatusActive() {
    const allBatchStatuses = document.querySelectorAll('.batch-status');
    allBatchStatuses.forEach(status => status.classList.remove('active'));
}

// バッチ割ボタンのアクティブ状態を設定する関数
function setBatchStatusActive(element) {
    // 全てのバッチ割ボタンのアクティブ状態をクリア
    clearBatchStatusActive();
    // クリックされたバッチ割ボタンをアクティブにする
    if (element) {
        element.classList.add('active');
    }
}

// 注文情報に基づいて行を選択状態にする関数
function selectRowByOrderInfo(orderInfo) {
    // まず全ての行の選択を解除
    clearRowSelection();
    
    // 対応する行を見つけて選択状態にする
    const allRows = document.querySelectorAll('.order-table tbody tr');
    allRows.forEach(row => {
        const cells = row.querySelectorAll('td');
        if (cells.length >= 4) {
            const orderNo = cells[3].textContent.trim(); // 注文No列
            const line = cells[1].textContent.trim(); // ライン列
            
            if (orderNo === orderInfo.orderNo && line === orderInfo.line) {
                row.classList.add('selected');
            }
        }
    });
}

// 注文No、ライン、プロジェクトに基づいてorder-tableの行を選択状態にする関数
function selectOrderTableRowByOrderInfo(orderNo, line, project) {
    // 対応する行を見つけて選択状態にする
    const allRows = document.querySelectorAll('.order-table tbody tr');
    allRows.forEach(row => {
        const cells = row.querySelectorAll('td');
        if (cells.length >= 4) {
            const rowOrderNo = cells[3].textContent.trim(); // 注文No列
            const rowLine = cells[1].textContent.trim(); // ライン列
            const rowProject = cells[2].textContent.trim(); // プロジェクト列
            
            if (rowOrderNo === String(orderNo) && rowLine === line && rowProject === project) {
                row.classList.add('selected');
            }
        }
    });
}

// order-tableの行の選択状態をクリアする関数
function clearOrderTableRowSelection() {
    const allRows = document.querySelectorAll('.order-table tbody tr');
    allRows.forEach(row => row.classList.remove('selected'));
}
