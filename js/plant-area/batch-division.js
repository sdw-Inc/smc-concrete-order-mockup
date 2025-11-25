// ========================================
// バッチ分割機能
// ========================================

// バッチ分割機能の初期化
function initializeBatchDivision() {
    try {
        setupBatchDivisionEvents();
        setupBatchModeEvents();
    } catch (error) {
        console.error('バッチ分割機能の初期化でエラーが発生しました:', error);
    }
}

// バッチ分割モーダルを表示する関数
function showBatchDivisionModal(orderInfo) {
    try {
        // バッチ分割エリアに情報を表示
        displayBatchDivisionInfo(orderInfo);
    } catch (error) {
        console.error('バッチ分割モーダル表示でエラーが発生しました:', error);
    }
}

// バッチ分割表示をクリアする関数
function clearBatchDivisionDisplay() {
    try {
        const elements = {
            line: document.getElementById('batch-line'),
            project: document.getElementById('batch-project'),
            orderNo: document.getElementById('batch-order-no'),
            quantity: document.getElementById('batch-quantity'),
            rule: document.getElementById('batch-rule'),
            message: document.getElementById('batch-message')
        };
        
        // 各要素を初期値に戻す
        for (const [key, element] of Object.entries(elements)) {
            if (element) {
                element.textContent = '-';
            }
        }
        
        // バッチサイズ入力を初期値に戻す
        const batchSizeInput = document.getElementById('batch-size-input');
        if (batchSizeInput) {
            batchSizeInput.value = '';
        }
        
        // バッチ間隔入力を初期値に戻す
        const batchIntervalInput = document.getElementById('batch-interval-input');
        const batchIntervalSpecified = document.getElementById('batch-interval-specified');
        if (batchIntervalInput) {
            batchIntervalInput.value = '';
        }
        if (batchIntervalSpecified) {
            batchIntervalSpecified.style.display = 'none';
            batchIntervalSpecified.textContent = '';
        }
        
        // バッチリストをクリア
        const batchList = document.getElementById('batch-list');
        if (batchList) {
            batchList.innerHTML = '';
        }
        
        // バッチ追加ボタンの状態を更新
        updateBatchAddButtonState();
        
        // バッチ確定ボタンの状態を更新
        updateBatchConfirmButtonState();
    } catch (error) {
        console.error('バッチ分割表示クリアでエラーが発生しました:', error);
    }
}

// 現在表示されている注文の残りを再計算する関数
function updateRemainingQuantity() {
    if (currentDisplayedOrder) {
        // 既存のupdateRemainingVolume関数を使用して残り量を再計算
        updateRemainingVolume();
    }
}

// バッチ間隔入力値を取得する関数
function getBatchInterval() {
    const batchIntervalInput = document.getElementById('batch-interval-input');
    if (batchIntervalInput) {
        const value = parseInt(batchIntervalInput.value, 10);
        return isNaN(value) || value < 1 ? 10 : value; // デフォルト値は10
    }
    return 10; // 要素が見つからない場合も10を返す
}

// バッチ分割情報を表示する関数
function displayBatchDivisionInfo(orderInfo) {
    try {
        const elements = {
            line: document.getElementById('batch-line'),
            project: document.getElementById('batch-project'),
            orderNo: document.getElementById('batch-order-no'),
            quantity: document.getElementById('batch-quantity'),
            rule: document.getElementById('batch-rule'),
            message: document.getElementById('batch-message')
        };
        
        // 要素の存在確認
        for (const [key, element] of Object.entries(elements)) {
            if (!element) {
                console.warn(`バッチ分割情報要素が見つかりません: ${key}`);
                return;
            }
        }
        
        // order-data.jsから直接batchRuleとmessageを取得
        let batchRule = '-';
        let message = '-';
        let order = null;
        
        try {
            // 現在選択されている工場を取得
            const factorySelect = document.querySelector('.factory-selector');
            const currentFactory = factorySelect ? factorySelect.value : 'tochigi-factory';
            
            // 工場データを取得
            const factoryData = orderData[currentFactory];
            if (factoryData) {
                // ラインのデータを取得
                // まず、指定されたラインで検索
                let lineData = factoryData[orderInfo.line];
                
                if (lineData) {
                    // 注文Noで検索
                    order = lineData.find(o => o.orderNo === orderInfo.orderNo);
                }
                
                // 見つからない場合、すべてのラインを検索（データが別のライン配列にある場合に対応）
                if (!order) {
                    for (const lineKey in factoryData) {
                        const currentLineData = factoryData[lineKey];
                        if (Array.isArray(currentLineData)) {
                            // 注文Noとプロジェクト名の両方で検索（より確実に）
                            order = currentLineData.find(o => 
                                o.orderNo === orderInfo.orderNo && 
                                o.project === orderInfo.project
                            );
                            if (order) {
                                break;
                            }
                        }
                    }
                }
                
                if (order) {
                    batchRule = order.batchRule || '-';
                    message = order.message || '-';
                }
            }
        } catch (error) {
            console.error('データ取得でエラーが発生しました:', error);
        }
        
        // 情報を安全に設定
        elements.line.textContent = orderInfo.line || '-';
        elements.project.textContent = orderInfo.project || '-';
        elements.orderNo.textContent = orderInfo.orderNo || '-';
        const volumeText = orderInfo.volume ? parseFloat(orderInfo.volume).toFixed(2) + '㎥' : '';
        elements.quantity.textContent = `${orderInfo.strength || ''} ${volumeText}`;
        elements.rule.textContent = batchRule;
        
        // メッセージの設定（コメントがない時は「-」を表示しない）
        elements.message.textContent = message === '-' ? '' : message;
        
        // バッチ間隔の表示を更新（orderが見つかった場合も見つからない場合も処理）
        const batchIntervalInput = document.getElementById('batch-interval-input');
        const batchIntervalSpecified = document.getElementById('batch-interval-specified');
        
        if (batchIntervalInput && batchIntervalSpecified) {
            // batchTimeを取得
            let batchTime = null;
            if (order && order.batchTime && order.batchTime.trim() !== '') {
                batchTime = order.batchTime.trim();
            }
            
            // batchTimeが空欄でない場合、指定表示を表示
            if (batchTime) {
                batchIntervalSpecified.textContent = `指定:${batchTime}分間隔`;
                batchIntervalSpecified.style.display = 'inline';
                // 入力欄の値をbatchTimeに設定
                batchIntervalInput.value = batchTime;
            } else {
                batchIntervalSpecified.style.display = 'none';
                // デフォルト値10を設定
                batchIntervalInput.value = '10';
            }
        }
        
        // 残り量の計算（batch-remaining要素を更新）
        // 少し遅延してから残りを更新（DOM更新を待つ）
        setTimeout(() => {
            updateRemainingVolume();
        }, 10);
        
        // バッチ追加ボタンの状態を更新
        updateBatchAddButtonState();
        
        // バッチ確定ボタンの状態を更新
        updateBatchConfirmButtonState();
    } catch (error) {
        console.error('バッチ分割情報表示でエラーが発生しました:', error);
    }
}


// バッチ分割エリアのイベント設定
function setupBatchDivisionEvents() {
    // バッチ分割確定ボタンのイベント
    const batchConfirmBtn = document.getElementById('batch-confirm-btn');
    if (batchConfirmBtn) {
        batchConfirmBtn.addEventListener('click', function() {
            handleBatchConfirm();
        });
    }
    
    // バッチサイズ入力のバリデーション
    setupBatchSizeValidation();
    
    // バッチ追加ボタンのイベント
    setupBatchAddButton();
    
    // 一括削除ボタンのイベント
    setupBatchClearButton();
    
    // バッチ確定ボタンの初期状態を設定
    updateBatchConfirmButtonState();
}

// バッチサイズ入力のバリデーション設定
function setupBatchSizeValidation() {
    const batchSizeInput = document.getElementById('batch-size-input');
    const batchAddBtn = document.querySelector('.batch-add-btn');
    
    if (batchSizeInput && batchAddBtn) {
        // 初期状態でボタンを無効化
        updateBatchAddButtonState();
        
        // 入力値変更時のバリデーション
        batchSizeInput.addEventListener('input', updateBatchAddButtonState);
        batchSizeInput.addEventListener('change', updateBatchAddButtonState);
    }
}

// バッチ追加ボタンの状態更新
function updateBatchAddButtonState() {
    const batchSizeInput = document.getElementById('batch-size-input');
    const batchAddBtn = document.querySelector('.batch-add-btn');
    
    if (!batchSizeInput || !batchAddBtn) return;
    
    const value = parseFloat(batchSizeInput.value);
    const isValid = !isNaN(value) && value > 0;
    
    // 注文明細データが表示されているかチェック
    const hasOrderData = checkIfOrderDataIsDisplayed();
    
    if (isValid && hasOrderData) {
        batchAddBtn.disabled = false;
        batchAddBtn.style.backgroundColor = '';
        batchAddBtn.style.cursor = 'pointer';
    } else {
        batchAddBtn.disabled = true;
        batchAddBtn.style.backgroundColor = '#cccccc';
        batchAddBtn.style.cursor = 'not-allowed';
    }
}

// 注文明細データが表示されているかチェック
function checkIfOrderDataIsDisplayed() {
    const orderNoElement = document.getElementById('batch-order-no');
    const quantityElement = document.getElementById('batch-quantity');
    
    if (!orderNoElement || !quantityElement) return false;
    
    // 注文Noと数量が初期値（'-'）でないかチェック
    const hasOrderNo = orderNoElement.textContent !== '-';
    const hasQuantity = quantityElement.textContent !== '-';
    
    return hasOrderNo && hasQuantity;
}

// バッチ追加ボタンのイベント設定
function setupBatchAddButton() {
    const batchAddBtn = document.querySelector('.batch-add-btn');
    if (batchAddBtn) {
        batchAddBtn.addEventListener('click', handleBatchAdd);
    }
}

// バッチ追加処理
function handleBatchAdd() {
    const batchSizeInput = document.getElementById('batch-size-input');
    const autoModeRadio = document.getElementById('auto-mode');
    const manualModeRadio = document.getElementById('manual-mode');
    
    if (!batchSizeInput || !autoModeRadio || !manualModeRadio) return;
    
    const batchSize = parseFloat(batchSizeInput.value);
    if (isNaN(batchSize) || batchSize <= 0) return;
    
    if (autoModeRadio.checked) {
        handleAutoBatchDivision(batchSize);
    } else if (manualModeRadio.checked) {
        handleManualBatchDivision(batchSize);
    }
}

// 自動分割処理
function handleAutoBatchDivision(batchSize) {
    const quantityElement = document.getElementById('batch-quantity');
    const orderNoElement = document.getElementById('batch-order-no');
    
    if (!quantityElement || !orderNoElement) return;
    
    // 数量から㎥数を取得（例: "FC24 2.5" から "2.5" を抽出）
    const quantityText = quantityElement.textContent;
    const volumeMatch = quantityText.match(/(\d+\.?\d*)\s*㎥?$/);
    if (!volumeMatch) return;
    
    const totalVolume = parseFloat(volumeMatch[1]);
    const orderNo = orderNoElement.textContent;
    
    // 既存のバッチリストをクリア
    clearBatchList();
    
    // 現在時刻を取得
    const now = new Date();
    
    // 残り量を追跡しながらバッチを生成
    let remainingVolume = totalVolume;
    let batchNumber = 1;
    
    // 最初に1バッチ量が総量より大きい場合はエラー
    if (batchSize > totalVolume) {
        alert(`エラー: 1バッチ量(${batchSize}㎥)が総量(${totalVolume}㎥)より大きいです。`);
        return;
    }
    
    while (remainingVolume > 0) {
        // バッチ量を決定（残りが1バッチ量より小さい場合は残り全部）
        const currentBatchSize = Math.min(batchSize, remainingVolume);
        
        // 浮動小数点の計算誤差を修正
        const roundedBatchSize = Math.round(currentBatchSize * 1000) / 1000;
        
        // バッチ時刻を計算（バッチ間隔分ずつ追加）
        const batchInterval = getBatchInterval();
        const batchTime = new Date(now.getTime() + ((batchNumber - 1) * batchInterval * 60 * 1000));
        
        // バッチを追加
        addBatchToList(orderNo, batchNumber, roundedBatchSize, batchTime);
        
        // 残り量を更新（計算誤差を修正）
        remainingVolume = Math.round((remainingVolume - roundedBatchSize) * 1000) / 1000;
        batchNumber++;
    }
}

// 手動入力処理
function handleManualBatchDivision(batchSize) {
    const orderNoElement = document.getElementById('batch-order-no');
    
    if (!orderNoElement) return;
    
    const orderNo = orderNoElement.textContent;
    const now = new Date();
    
    // 1行追加
    addBatchToList(orderNo, getNextBatchNumber(), batchSize, now);
}

// バッチリストに追加
function addBatchToList(orderNo, batchNumber, volume, time) {
    const batchList = document.getElementById('batch-list');
    if (!batchList) return;
    
    const row = document.createElement('tr');
    row.innerHTML = `
        <td class="batch-no-cell">${orderNo}-${batchNumber}</td>
        <td class="batch-m3-cell">
            <input type="number" class="batch-m3-input" value="${volume.toFixed(2)}" step="0.01" min="0" onchange="updateRemainingVolume()">
        </td>
        <td class="batch-remove-cell">
            <button class="batch-remove-btn" onclick="removeBatchRow(this)">×</button>
        </td>
    `;
    
    batchList.appendChild(row);
    
    // 残り量を更新
    updateRemainingVolume();
    
    // 現在表示されている注文の残りを再計算
    updateRemainingQuantity();
    
    // 一括削除ボタンの表示を更新
    updateClearButtonVisibility();
    
    // バッチ確定ボタンの状態を更新
    updateBatchConfirmButtonState();
}

// 小数点桁数を取得する関数
function getDecimalPlaces(num) {
    const str = num.toString();
    if (str.indexOf('.') === -1) {
        return 1; // 整数の場合は小数点第1位まで
    }
    const decimalPart = str.split('.')[1];
    return Math.max(1, decimalPart.length); // 最低1桁、最大は元の桁数
}

// 時刻をフォーマット
function formatTime(date) {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
}

// 次のバッチ番号を取得
function getNextBatchNumber() {
    const batchList = document.getElementById('batch-list');
    if (!batchList) return 1;
    
    const rows = batchList.querySelectorAll('tr');
    return rows.length + 1;
}

// バッチ行を削除
function removeBatchRow(button) {
    const row = button.closest('tr');
    if (row) {
        row.remove();
        // バッチNoを再番号付け
        renumberBatchList();
        // 残り量を更新
        updateRemainingVolume();
        
        // 現在表示されている注文の残りを再計算
        updateRemainingQuantity();
        
        // 一括削除ボタンの表示を更新
        updateClearButtonVisibility();
        
        // バッチ確定ボタンの状態を更新
        updateBatchConfirmButtonState();
    }
}

// 残り量を更新
function updateRemainingVolume() {
    const quantityElement = document.getElementById('batch-quantity');
    const remainingElement = document.getElementById('batch-remaining');
    
    
    if (!quantityElement || !remainingElement) {
        return;
    }
    
    // 数量から㎥数を取得
    const quantityText = quantityElement.textContent;
    // 60N 11.4㎥ の形式に対応（全角㎥のみ）
    const volumeMatch = quantityText.match(/(\d+\.?\d*)\s*㎥$/);
    if (!volumeMatch) {
        remainingElement.textContent = '-';
        return;
    }
    
    const totalVolume = parseFloat(volumeMatch[1]);
    
    // バッチリストの全行の㎥数を合計
    const batchList = document.getElementById('batch-list');
    let usedVolume = 0;
    
    if (batchList) {
        const m3Inputs = batchList.querySelectorAll('.batch-m3-input');
        m3Inputs.forEach(input => {
            const value = parseFloat(input.value);
            if (!isNaN(value)) {
                usedVolume += value;
            }
        });
    }
    
    // 残り量を計算
    const remaining = totalVolume - usedVolume;
    remainingElement.textContent = `${remaining.toFixed(2)}㎥`;
}

// バッチリストをクリア
function clearBatchList() {
    const batchList = document.getElementById('batch-list');
    if (batchList) {
        batchList.innerHTML = '';
        // 残り量を更新
        updateRemainingVolume();
        // 一括削除ボタンの表示を更新
        updateClearButtonVisibility();
        // バッチ確定ボタンの状態を更新
        updateBatchConfirmButtonState();
    }
}

// 一括削除ボタンの表示制御
function updateClearButtonVisibility() {
    const clearBtn = document.getElementById('batch-clear-btn');
    const batchList = document.getElementById('batch-list');
    
    if (clearBtn && batchList) {
        const rows = batchList.querySelectorAll('tr');
        if (rows.length > 0) {
            clearBtn.style.display = 'block';
        } else {
            clearBtn.style.display = 'none';
        }
    }
}

// バッチNoを再番号付け
function renumberBatchList() {
    const batchList = document.getElementById('batch-list');
    if (!batchList) return;
    
    const rows = batchList.querySelectorAll('tr');
    const orderNoElement = document.getElementById('batch-order-no');
    
    if (!orderNoElement) return;
    const orderNo = orderNoElement.textContent;
    
    // 各行のバッチNoを上から順に更新
    rows.forEach((row, index) => {
        const batchNoCell = row.querySelector('.batch-no-cell');
        if (batchNoCell) {
            batchNoCell.textContent = `${orderNo}-${index + 1}`;
        }
    });
}

// 一括削除ボタンの設定
function setupBatchClearButton() {
    const clearBtn = document.getElementById('batch-clear-btn');
    if (clearBtn) {
        clearBtn.addEventListener('click', function() {
            if (confirm('すべてのバッチを削除しますか？')) {
                clearBatchList();
            }
        });
    }
}


// ========================================
// バッチモード選択機能
// ========================================

// バッチモードラジオボタンのイベント設定
function setupBatchModeEvents() {
    try {
        const autoModeRadio = document.getElementById('auto-mode');
        const manualModeRadio = document.getElementById('manual-mode');
        
        // 要素の存在確認
        if (!autoModeRadio || !manualModeRadio) {
            console.warn('バッチモードラジオボタンが見つかりません');
            return;
        }
        
        // 既存のイベントリスナーを削除（重複防止）
        autoModeRadio.removeEventListener('change', handleAutoModeChange);
        manualModeRadio.removeEventListener('change', handleManualModeChange);
        
        // 新しいイベントリスナーを追加
        autoModeRadio.addEventListener('change', handleAutoModeChange);
        manualModeRadio.addEventListener('change', handleManualModeChange);
    } catch (error) {
        console.warn('バッチモードイベント設定でエラーが発生しました:', error);
    }
}

// 自動分割モード変更ハンドラー
function handleAutoModeChange() {
    if (this.checked) {
        handleAutoMode();
    }
}

// 手動入力モード変更ハンドラー
function handleManualModeChange() {
    if (this.checked) {
        handleManualMode();
    }
}

// 自動分割モードの処理
function handleAutoMode() {
    // 自動分割モードの処理を実装
    // 例：バッチサイズの自動計算、UIの変更など
}

// 手動入力モードの処理
function handleManualMode() {
    // 手動入力モードの処理を実装
    // 例：手動入力フィールドの有効化、UIの変更など
}

// バッチモードのデフォルト値設定
function updateBatchModeDefault(factoryValue) {
    try {
        const autoModeRadio = document.getElementById('auto-mode');
        const manualModeRadio = document.getElementById('manual-mode');
        
        if (autoModeRadio && manualModeRadio) {
            if (factoryValue === 'tochigi-factory') {
                // 栃木工場は自動分割をデフォルト
                autoModeRadio.checked = true;
                manualModeRadio.checked = false;
            } else if (factoryValue === 'ibaraki-factory') {
                // 茨城工場は手動分割をデフォルト
                autoModeRadio.checked = false;
                manualModeRadio.checked = true;
            }
        }
    } catch (error) {
        console.warn('バッチモードのデフォルト値設定でエラーが発生しました:', error);
    }
}

// バッチ確定ボタンの状態を更新する関数
function updateBatchConfirmButtonState() {
    const batchConfirmBtn = document.getElementById('batch-confirm-btn');
    if (!batchConfirmBtn) return;
    
    const batchList = document.getElementById('batch-list');
    if (!batchList) {
        batchConfirmBtn.disabled = true;
        return;
    }
    
    // バッチリストにデータがあるかチェック
    const rows = batchList.querySelectorAll('tr');
    const hasBatchData = rows.length > 0;
    
    // データがある場合は有効、ない場合は無効
    batchConfirmBtn.disabled = !hasBatchData;
}

// バッチ確定ボタンのクリック処理
function handleBatchConfirm() {
    try {
        // 工場タイプを取得
        const factorySelect = document.querySelector('.factory-selector');
        const factoryValue = factorySelect ? factorySelect.value : 'tochigi-factory';
        
        // currentDisplayedOrderから注文情報を取得
        if (!currentDisplayedOrder) {
            console.warn('表示中の注文情報がありません');
            return;
        }
        
        // batch-listから全バッチデータを取得
        const batchList = document.getElementById('batch-list');
        if (!batchList) {
            console.warn('バッチリストが見つかりません');
            return;
        }
        
        const batchRows = batchList.querySelectorAll('tr');
        if (batchRows.length === 0) {
            console.warn('バッチデータがありません');
            return;
        }
        
        // バッチデータを配列に格納
        const batchData = [];
        batchRows.forEach((row, index) => {
            const batchNoCell = row.querySelector('.batch-no-cell');
            const m3Input = row.querySelector('.batch-m3-input');
            
            if (batchNoCell && m3Input) {
                batchData.push({
                    batchNo: batchNoCell.textContent.trim(),
                    m3: parseFloat(m3Input.value) || 0
                });
            }
        });
        
        if (batchData.length === 0) {
            console.warn('有効なバッチデータがありません');
            return;
        }
        
        // 基準時刻を取得（現在時刻）
        const baseTime = new Date();
        
        // 工場タイプに応じて処理を分岐
        if (factoryValue === 'tochigi-factory') {
            handleTochigiBatchConfirm(currentDisplayedOrder, batchData, baseTime);
        } else if (factoryValue === 'ibaraki-factory') {
            handleIbarakiBatchConfirm(currentDisplayedOrder, batchData, baseTime);
        }
        
        // 共通処理
        currentDisplayedOrder = null;
        clearBatchList();
        
    } catch (error) {
        console.error('バッチ確定処理でエラーが発生しました:', error);
    }
}

// 栃木工場用のバッチ確定処理
function handleTochigiBatchConfirm(orderInfo, batchData, baseTime) {
    try {
        const mixingOrderTbody = document.getElementById('mixing-order-tbody');
        if (!mixingOrderTbody) {
            console.warn('mixing-order-tbodyが見つかりません');
            return;
        }
        
        // 強度を取得（quantityから抽出、例: "60N 11.4㎥" → "60N"）
        const quantityText = document.getElementById('batch-quantity')?.textContent || '';
        const strengthMatch = quantityText.match(/^([A-Z0-9]+N?)/);
        const strength = strengthMatch ? strengthMatch[1] : orderInfo.strength || '';
        
        // 各バッチをmixing-order-tableに追加
        const batchInterval = getBatchInterval();
        batchData.forEach((batch, index) => {
            // 時刻を計算（基準時刻からバッチ間隔分ずつ加算）
            const batchTime = new Date(baseTime.getTime() + (index * batchInterval * 60 * 1000));
            const timeString = formatTime(batchTime);
            
            // 行を生成
            const row = document.createElement('tr');
            const m3Value = batch.m3.toFixed(2);
            row.innerHTML = `
                <td>${orderInfo.line}</td>
                <td>${orderInfo.project}</td>
                <td>${batch.batchNo}</td>
                <td>${strength}</td>
                <td>${m3Value}</td>
                <td>${timeString}</td>
                <td><button class="instruction-btn">指示</button></td>
            `;
            
            // テーブルに追加（時刻順でソートして挿入）
            insertMixingOrderRow(mixingOrderTbody, row, timeString);
        });
        
        // 指示ボタンのdata-indexを再設定
        const allRows = mixingOrderTbody.querySelectorAll('tr');
        allRows.forEach((row, index) => {
            const instructionBtn = row.querySelector('.instruction-btn');
            if (instructionBtn) {
                instructionBtn.setAttribute('data-index', index.toString());
            }
        });
        
        // 指示ボタンのイベントを再設定
        if (typeof setupInstructionButtonEvents === 'function') {
            setupInstructionButtonEvents();
        }
        if (typeof setupMixingOrderRowClickEvents === 'function') {
            setupMixingOrderRowClickEvents();
        }
        
        // order-data.jsの該当注文のbatchStatusをcompletedに更新
        updateOrderBatchStatus(orderInfo, 'completed');
        
        // order-tableを再描画
        const factorySelect = document.querySelector('.factory-selector');
        const factoryValue = factorySelect ? factorySelect.value : 'tochigi-factory';
        if (typeof updateOrderTableData === 'function') {
            updateOrderTableData(factoryValue);
        }
        
        // 選択状態を解除
        if (typeof clearRowSelection === 'function') {
            clearRowSelection();
        }
        
        // バッチ分割表示をクリア
        clearBatchDivisionDisplay();
        
    } catch (error) {
        console.error('栃木工場のバッチ確定処理でエラーが発生しました:', error);
    }
}

// mixing-order-tableに行を時刻順で挿入
function insertMixingOrderRow(tbody, newRow, newTime) {
    const rows = Array.from(tbody.querySelectorAll('tr'));
    const newTimeMinutes = timeToMinutes(newTime);
    
    let insertIndex = rows.length;
    for (let i = 0; i < rows.length; i++) {
        const timeCell = rows[i].querySelector('td:nth-child(6)');
        if (timeCell) {
            const rowTime = timeCell.textContent.trim();
            const rowTimeMinutes = timeToMinutes(rowTime);
            if (rowTimeMinutes > newTimeMinutes) {
                insertIndex = i;
                break;
            }
        }
    }
    
    if (insertIndex === rows.length) {
        tbody.appendChild(newRow);
    } else {
        tbody.insertBefore(newRow, rows[insertIndex]);
    }
}

// 時刻文字列（HH:MM）を分に変換
function timeToMinutes(timeString) {
    if (!timeString || timeString === '-') return 0;
    const parts = timeString.split(':');
    if (parts.length !== 2) return 0;
    const hours = parseInt(parts[0], 10) || 0;
    const minutes = parseInt(parts[1], 10) || 0;
    return hours * 60 + minutes;
}

// 茨城工場用のバッチ確定処理
function handleIbarakiBatchConfirm(orderInfo, batchData, baseTime) {
    try {
        // 強度を取得
        const quantityText = document.getElementById('batch-quantity')?.textContent || '';
        const strengthMatch = quantityText.match(/^([A-Z0-9]+N?)/);
        const strength = strengthMatch ? strengthMatch[1] : orderInfo.strength || '';
        
        // バッチデータをフォーマットして保存
        const batchInterval = getBatchInterval();
        const formattedBatches = batchData.map((batch, index) => {
            // 時刻を計算（基準時刻からバッチ間隔分ずつ加算）
            const batchTime = new Date(baseTime.getTime() + (index * batchInterval * 60 * 1000));
            const timeString = formatTime(batchTime);
            
            return {
                batchNo: batch.batchNo,
                m3: batch.m3,
                volume: batch.m3, // 互換性のため
                time: timeString,
                strength: strength,
                project: orderInfo.project || '',
                isCompleted: false
            };
        });
        
        // orderDataにbatchesプロパティを追加
        if (typeof orderData === 'undefined' || !orderData['ibaraki-factory']) {
            console.warn('orderDataが見つかりません');
            return;
        }
        
        const factoryData = orderData['ibaraki-factory'];
        
        // 該当する注文を検索
        let targetOrder = null;
        
        // まず、指定されたラインで検索
        if (factoryData[orderInfo.line]) {
            targetOrder = factoryData[orderInfo.line].find(o => 
                o.orderNo === orderInfo.orderNo && o.project === orderInfo.project
            );
        }
        
        // 見つからない場合、すべてのラインを検索
        if (!targetOrder) {
            for (const lineKey in factoryData) {
                const lineData = factoryData[lineKey];
                if (Array.isArray(lineData)) {
                    targetOrder = lineData.find(o => 
                        o.orderNo === orderInfo.orderNo && o.project === orderInfo.project
                    );
                    if (targetOrder) {
                        break;
                    }
                }
            }
        }
        
        if (!targetOrder) {
            console.warn('注文データが見つかりません:', {
                line: orderInfo.line,
                orderNo: orderInfo.orderNo,
                project: orderInfo.project
            });
            return;
        }
        
        // orderDataにbatchesプロパティを追加
        targetOrder.batches = formattedBatches;
        
        // order-data.jsの該当注文のbatchStatusをcompletedに更新
        updateOrderBatchStatus(orderInfo, 'completed');
        
        // order-tableを再描画
        const factorySelect = document.querySelector('.factory-selector');
        const factoryValue = factorySelect ? factorySelect.value : 'ibaraki-factory';
        if (typeof updateOrderTableData === 'function') {
            updateOrderTableData(factoryValue);
        }
        
        // lineDisplayedOrderMapに確定した注文情報を設定（該当ラインのバッチ割を表示するため）
        if (typeof lineDisplayedOrderMap !== 'undefined') {
            lineDisplayedOrderMap[orderInfo.line] = {
                orderNo: orderInfo.orderNo,
                project: orderInfo.project
            };
        }
        
        // 確定した注文をorder-tableで選択状態にする
        if (typeof selectRowByOrderInfo === 'function') {
            selectRowByOrderInfo(orderInfo);
        }
        
        // batch-schedule-tbodyを再描画（該当するラインの列にバッチ割を表示）
        if (typeof generateBatchScheduleData === 'function') {
            generateBatchScheduleData(orderInfo.line);
        }
        
        // バッチ分割表示をクリア
        clearBatchDivisionDisplay();
        
    } catch (error) {
        console.error('茨城工場のバッチ確定処理でエラーが発生しました:', error);
    }
}

// order-data.jsの該当注文のbatchStatusを更新
function updateOrderBatchStatus(orderInfo, status) {
    try {
        const factorySelect = document.querySelector('.factory-selector');
        const factoryValue = factorySelect ? factorySelect.value : 'tochigi-factory';
        
        if (typeof orderData === 'undefined' || !orderData[factoryValue]) {
            console.warn('orderDataが見つかりません');
            return;
        }
        
        const factoryData = orderData[factoryValue];
        
        // まず、指定されたラインで検索
        let lineData = factoryData[orderInfo.line];
        let order = null;
        
        if (lineData) {
            // 注文Noで検索
            order = lineData.find(o => o.orderNo === orderInfo.orderNo);
        }
        
        // 見つからない場合、すべてのラインを検索（データが別のライン配列にある場合に対応）
        if (!order) {
            for (const lineKey in factoryData) {
                const currentLineData = factoryData[lineKey];
                if (Array.isArray(currentLineData)) {
                    // 注文Noとプロジェクト名の両方で検索（より確実に）
                    order = currentLineData.find(o => 
                        o.orderNo === orderInfo.orderNo && 
                        o.project === orderInfo.project
                    );
                    if (order) {
                        break;
                    }
                }
            }
        }
        
        if (order) {
            order.batchStatus = status;
        } else {
            console.warn('注文データが見つかりません:', {
                line: orderInfo.line,
                orderNo: orderInfo.orderNo,
                project: orderInfo.project
            });
        }
    } catch (error) {
        console.error('batchStatus更新でエラーが発生しました:', error);
    }
}
