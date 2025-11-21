// ========================================
// ラインエリア - QRスキャナー機能
// ========================================

// 現在表示されている注文アイテムの数を追跡する変数
let visibleOrderItemCount = 0;

// QRスキャナー関連のイベント設定
function setupLineAreaQRScannerEvents() {
    // QR読取ボタンのクリックイベント
    const qrBtn = document.querySelector('.qr-btn');
    if (qrBtn) {
        qrBtn.addEventListener('click', function() {
            // 注文アイテムを1つずつ増やして表示
            showNextOrderItem();
            // 読取解除ボタンを表示
            showQRClearButton();
        });
    }

    // 読取解除ボタンのクリックイベント
    const qrClearBtn = document.querySelector('.qr-clear-btn');
    if (qrClearBtn) {
        qrClearBtn.addEventListener('click', function() {
            // QR読取を完了し、元のデータを全て表示
            resetQRScanState();
        });
    }
}

// 注文アイテムを1つずつ増やして表示する関数
function showNextOrderItem() {
    const orderItems = document.querySelectorAll('.order-item');
    const totalItems = orderItems.length;
    
    // 表示数を1つ増やす（最大数まで）
    if (visibleOrderItemCount < totalItems) {
        visibleOrderItemCount++;
    }
    
    // 指定された数だけ表示
    orderItems.forEach((item, index) => {
        if (index < visibleOrderItemCount) {
            // 表示するアイテム
            item.style.display = 'block';
        } else {
            // 非表示にするアイテム
            item.style.display = 'none';
        }
    });
}

// 注文アイテム1のみを表示する関数（後方互換性のため残す）
function showOnlyFirstOrderItem() {
    visibleOrderItemCount = 1;
    showNextOrderItem();
}

// 全ての注文アイテムを表示する関数
function showAllOrderItems() {
    const orderItems = document.querySelectorAll('.order-item');
    
    // すべての注文アイテムを表示
    orderItems.forEach(item => {
        item.style.display = 'block';
    });
}

// 読取解除ボタンを表示する関数
function showQRClearButton() {
    const qrClearBtn = document.querySelector('.qr-clear-btn');
    if (qrClearBtn) {
        qrClearBtn.style.display = 'inline-block';
    }
}

// 読取解除ボタンを非表示にする関数
function hideQRClearButton() {
    const qrClearBtn = document.querySelector('.qr-clear-btn');
    if (qrClearBtn) {
        qrClearBtn.style.display = 'none';
    }
}

// QR読取状態をリセットし、元のデータを全て表示する関数
function resetQRScanState() {
    // カウンターをリセット
    visibleOrderItemCount = 0;
    
    // 全ての注文アイテムを表示
    showAllOrderItems();
    
    // フィルタリングをリセット（全て表示）
    if (typeof filterOrderItems === 'function') {
        filterOrderItems('all');
    }
    
    // フィルタセレクターを「全ての製品を表示」にリセット
    const filterSelector = document.querySelector('.filter-selector');
    if (filterSelector) {
        filterSelector.value = 'all';
    }
    
    // 全てのチェックボックスのチェックを外す
    const allCheckboxes = document.querySelectorAll('#order-grid .concrete-option input[type="checkbox"]');
    allCheckboxes.forEach(checkbox => {
        checkbox.checked = false;
        checkbox.disabled = false;
    });
    
    // 読取解除ボタンを非表示
    hideQRClearButton();
}
