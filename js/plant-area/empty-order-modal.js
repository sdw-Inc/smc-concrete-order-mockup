// ========================================
// 空注文追加モーダル機能
// ========================================

// 選択されたデータを追跡する変数（空注文用）
let emptySelectedData = {
    cells: [],
    project: null,
    date: null,
    line: null,
    formworkNumbers: []
};

// 空注文追加モーダルの初期化
function initializeEmptyOrderModal() {
    setupEmptyModalEvents();
}

// 空注文追加モーダルイベントの設定
function setupEmptyModalEvents() {
    // キャンセルボタン
    const cancelBtn = document.getElementById('empty-modal-cancel');
    if (cancelBtn) {
        cancelBtn.addEventListener('click', hideEmptyOrderModal);
    }
    
    // 確認ボタン
    const confirmBtn = document.getElementById('empty-modal-confirm');
    if (confirmBtn) {
        confirmBtn.addEventListener('click', handleEmptyOrderConfirm);
    }
    
    //強度入力の変更イベント
    const mixInput = document.getElementById('empty-modal-mix');
    if (mixInput) {
        mixInput.addEventListener('input', validateEmptyOrderForm);
    }
    
    // コンクリート量入力の変更イベント
    const concreteInput = document.getElementById('empty-modal-concrete');
    if (concreteInput) {
        concreteInput.addEventListener('input', validateEmptyOrderForm);
    }
    
    // モーダル外クリックで閉じる
    const modalOverlay = document.getElementById('empty-order-modal');
    if (modalOverlay) {
        modalOverlay.addEventListener('click', function(e) {
            if (e.target === modalOverlay) {
                hideEmptyOrderModal();
            }
        });
    }
}

// 空注文追加モーダルを表示
function showEmptyOrderModal(data) {
    const modal = document.getElementById('empty-order-modal');
    if (modal) {
        // データを保存
        emptySelectedData = data;
        updateEmptyModalContent(data);
        modal.style.display = 'flex';
    }
}

// 空注文追加モーダルを非表示
function hideEmptyOrderModal() {
    const modal = document.getElementById('empty-order-modal');
    if (modal) {
        modal.style.display = 'none';
        // フォームをリセット
        resetEmptyOrderForm();
    }
}

// 空注文追加モーダルの内容を更新
function updateEmptyModalContent(selectedData) {
    // 日付
    const dateElement = document.getElementById('empty-modal-date');
    if (dateElement) {
        dateElement.textContent = selectedData.date || '-';
    }
    
    // ライン
    const lineElement = document.getElementById('empty-modal-line');
    if (lineElement) {
        lineElement.textContent = selectedData.line || '-';
    }
    
    // 工事名称
    const projectElement = document.getElementById('empty-modal-project');
    if (projectElement) {
        projectElement.textContent = selectedData.project || '-';
    }
    
    // 型枠番号
    const formworkElement = document.getElementById('empty-modal-formwork');
    if (formworkElement) {
        if (selectedData.formworkNumbers && selectedData.formworkNumbers.length > 0) {
            formworkElement.textContent = selectedData.formworkNumbers.join(', ');
        } else {
            formworkElement.textContent = '-';
        }
    }
    
    // フォームをリセット
    resetEmptyOrderForm();
}

// フォームをリセット
function resetEmptyOrderForm() {
    const mixInput = document.getElementById('empty-modal-mix');
    const concreteInput = document.getElementById('empty-modal-concrete');
    const confirmBtn = document.getElementById('empty-modal-confirm');
    
    if (mixInput) mixInput.value = '';
    if (concreteInput) concreteInput.value = '';
    if (confirmBtn) confirmBtn.disabled = true;
}

// フォームのバリデーション
function validateEmptyOrderForm() {
    const mixInput = document.getElementById('empty-modal-mix');
    const concreteInput = document.getElementById('empty-modal-concrete');
    const confirmBtn = document.getElementById('empty-modal-confirm');
    
    if (!mixInput || !concreteInput || !confirmBtn) return;
    
    const mixValue = mixInput.value.trim();
    const concreteValue = concreteInput.value.trim();
    
    // 強度とコンクリート量の両方が入力されているかチェック
    const isValid = mixValue !== '' && concreteValue !== '' && parseFloat(concreteValue) > 0;
    
    confirmBtn.disabled = !isValid;
}

// 空注文確定の処理
function handleEmptyOrderConfirm() {
    const mixInput = document.getElementById('empty-modal-mix');
    const concreteInput = document.getElementById('empty-modal-concrete');
    
    if (!mixInput || !concreteInput) return;
    
    const selectedMix = mixInput.value.trim();
    const concreteQuantity = concreteInput.value.trim();
    
    // バリデーション
    if (!selectedMix) {
        alert('強度を入力してください');
        return;
    }
    
    if (!concreteQuantity || parseFloat(concreteQuantity) <= 0) {
        alert('コンクリート量を正しく入力してください');
        return;
    }
    
    // 確認ダイアログを表示
    if (!confirm('空注文を追加します。よろしいですか？')) {
        return;
    }
    
    // 空注文データを作成
    const orderDataObj = createEmptyOrderData(selectedMix, concreteQuantity);
    
    // 注文明細に追加
    if (typeof addOrderToTable === 'function') {
        addOrderToTable(orderDataObj);
    }
    
    // モーダルを閉じる
    hideEmptyOrderModal();
    
    // 選択をクリア
    if (typeof clearSelection === 'function') {
        clearSelection();
    }
}

// 空注文データを作成する関数
function createEmptyOrderData(selectedMix, concreteQuantity) {
    const currentTime = new Date();
    const timeString = typeof formatTime === 'function' ? formatTime(currentTime) : '00:00';
    
    // 注文Noを取得（最大注文No + 1）
    const nextOrderNo = typeof getNextOrderNo === 'function' ? getNextOrderNo() : '1';
    
    // コンクリート量をフォーマット
    const formattedM3 = formatM3ValueFromInput(concreteQuantity);
    
    // 型枠番号を取得（複数の場合は半角スペースで表示）
    const formworkNumbers = emptySelectedData.formworkNumbers || [];
    const formworkDisplay = formworkNumbers.length > 0 ? formworkNumbers.join(' ') : '';
    
    return {
        time: timeString,
        line: emptySelectedData.line,
        project: emptySelectedData.project,
        orderNo: nextOrderNo,
        unloadingNo: '', // 空欄
        formworkNo: formworkDisplay, // 型枠番号（複数時は半角スペース）
        strength: selectedMix, // 強度
        mixNo: '', // 調合No（空欄）
        m3: formattedM3, // ㎥（単位付き、適切な小数点表示）
        batcher: '第2', // バッチャー
        batchStatus: 'バッチ割', // バッチ割
        mixingQuantity: '0㎥' // 練混数量
    };
}

// 入力されたコンクリート量をフォーマットする関数
function formatM3ValueFromInput(concreteQuantity) {
    if (!concreteQuantity || concreteQuantity === '') {
        return '-';
    }
    
    const value = parseFloat(concreteQuantity);
    
    if (isNaN(value) || value <= 0) {
        return '-';
    }
    
    // 小数点第1位まで表示し、小数点第1位以下に0以外の数字がある場合はそれも表示
    const rounded = Math.round(value * 10) / 10; // 小数点第1位で四捨五入
    const hasSignificantDecimals = (value * 10) % 1 !== 0; // 小数点第1位以下に0以外の数字があるか
    
    if (hasSignificantDecimals) {
        // 小数点第1位以下に0以外の数字がある場合は、その桁数まで表示
        const decimalPlaces = typeof getDecimalPlaces === 'function' ? getDecimalPlaces(value) : 1;
        return `${value.toFixed(decimalPlaces)}㎥`;
    } else {
        // 小数点第1位以下が0の場合は、小数点第1位まで表示
        return `${rounded.toFixed(1)}㎥`;
    }
}
