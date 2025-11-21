// ========================================
// 注文削除モーダル機能
// ========================================

// 削除対象の注文情報を追跡する変数
let deleteTargetOrder = null;

// 注文削除モーダルの初期化
function initializeDeleteOrderModal() {
    setupDeleteModalEvents();
}

// 削除モーダルイベントの設定
function setupDeleteModalEvents() {
    // キャンセルボタン
    const cancelBtn = document.getElementById('delete-modal-cancel');
    if (cancelBtn) {
        cancelBtn.addEventListener('click', hideDeleteOrderModal);
    }
    
    // 削除確認ボタン
    const confirmBtn = document.getElementById('delete-modal-confirm');
    if (confirmBtn) {
        confirmBtn.addEventListener('click', handleDeleteConfirm);
    }
    
    // モーダル外クリックで閉じる
    const modalOverlay = document.getElementById('delete-order-modal');
    if (modalOverlay) {
        modalOverlay.addEventListener('click', function(e) {
            if (e.target === modalOverlay) {
                hideDeleteOrderModal();
            }
        });
    }
}

// 削除ボタンクリック時の処理
function showDeleteOrderModal(deleteBtn) {
    // ボタンが無効化されている場合は何もしない
    if (deleteBtn.disabled) {
        return;
    }
    
    const row = deleteBtn.closest('tr');
    if (!row) return;
    
    // 行から注文情報を抽出
    deleteTargetOrder = extractOrderInfoFromRow(row);
    if (!deleteTargetOrder) return;
    
    // モーダルの内容を更新
    updateDeleteModalContent();
    
    // モーダルを表示
    const modal = document.getElementById('delete-order-modal');
    if (modal) {
        modal.style.display = 'flex';
    }
}

// 削除モーダルの内容を更新
function updateDeleteModalContent() {
    if (!deleteTargetOrder) return;
    
    // 日付（本日をYYYY/MM/DDで表示）
    const dateElement = document.getElementById('delete-modal-date');
    if (dateElement) {
        const now = new Date();
        const y = now.getFullYear();
        const m = String(now.getMonth() + 1).padStart(2, '0');
        const d = String(now.getDate()).padStart(2, '0');
        dateElement.textContent = `${y}/${m}/${d}`;
    }
    
    // ライン
    const lineElement = document.getElementById('delete-modal-line');
    if (lineElement) {
        lineElement.textContent = deleteTargetOrder.line || '-';
    }
    
    // 型枠番号
    const formworkElement = document.getElementById('delete-modal-formwork');
    if (formworkElement) {
        formworkElement.textContent = deleteTargetOrder.formworkNo || '-';
    }
    
    // 工事名称
    const projectElement = document.getElementById('delete-modal-project');
    if (projectElement) {
        projectElement.textContent = deleteTargetOrder.project || '-';
    }
    
    // 強度
    const strengthElement = document.getElementById('delete-modal-strength');
    if (strengthElement) {
        strengthElement.textContent = deleteTargetOrder.strength || '-';
    }
    
    // コンクリート量
    const concreteElement = document.getElementById('delete-modal-concrete');
    if (concreteElement) {
        concreteElement.textContent = deleteTargetOrder.volume || '-';
    }
}

// 削除モーダルを非表示
function hideDeleteOrderModal() {
    const modal = document.getElementById('delete-order-modal');
    if (modal) {
        modal.style.display = 'none';
    }
    deleteTargetOrder = null;
}

// 削除確認の処理
function handleDeleteConfirm() {
    if (!deleteTargetOrder) return;
    
    // 確認ダイアログを表示
    if (!confirm('この注文を削除します。よろしいですか？')) {
        return;
    }
    
    // 注文を削除
    deleteOrderFromTable(deleteTargetOrder);
    
    // モーダルを閉じる
    hideDeleteOrderModal();
}

// テーブルから注文を削除
function deleteOrderFromTable(orderInfo) {
    const orderTable = document.querySelector('.order-table tbody');
    if (!orderTable) return;
    
    const rows = orderTable.querySelectorAll('tr');
    rows.forEach(row => {
        const cells = row.querySelectorAll('td');
        if (cells.length >= 4) {
            const orderNo = cells[3].textContent.trim(); // 注文No列
            const line = cells[1].textContent.trim(); // ライン列
            
            if (orderNo === orderInfo.orderNo && line === orderInfo.line) {
                row.remove();
            }
        }
    });
}

// 行から注文情報を抽出する関数（order-table.jsから複製）
function extractOrderInfoFromRow(row) {
    const cells = row.querySelectorAll('td');
    
    if (cells.length < 13) { // 削除列が追加されたので13列
        return null;
    }
    
    const orderNo = cells[3].textContent.trim();
    const line = cells[1].textContent.trim();
    
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
        wetQuantity: cells[11].textContent.trim()
    };
    
    return orderInfo;
}
