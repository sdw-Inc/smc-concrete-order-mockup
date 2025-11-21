// ========================================
// ラインエリア - モーダル管理
// ========================================

// 注文ボタンの状態を更新する関数
function updateOrderButtonEnabledState() {
    const orderBtn = document.querySelector('.order-button-container .order-btn');
    if (!orderBtn) return;
    
    // チェックボックスのチェック状態を確認
    const checkedCheckboxes = document.querySelectorAll('#order-grid .concrete-option input[type="checkbox"]:checked');
    
    // チェックボックスが1つでもチェックされている場合は有効化、そうでなければ無効化
    orderBtn.disabled = checkedCheckboxes.length === 0;
}

// モーダル関連のイベント設定
function setupLineAreaModalEvents() {
    // 注文ボタンのクリックイベント（注文画面の注文ボタンのみ）
    const orderBtn = document.querySelector('.order-button-container .order-btn');
    if (orderBtn) {
        orderBtn.addEventListener('click', function() {
            // ボタンが無効化されている場合は何もしない（念のため）
            if (this.disabled) {
                return;
            }
            
            showModal('quantity-input-modal');
            // モーダル表示時に初期化（注文画面用の情報を設定）
            initializeQuantityInputModalForOrder();
        });
    }

    // 生産指示画面の注文ボタンのクリックイベント
    const orderQuantityBtn = document.querySelector('.order-quantity-btn');
    if (orderQuantityBtn) {
        orderQuantityBtn.addEventListener('click', function() {
            // ボタンが無効化されている場合は何もしない（念のため）
            if (this.disabled) {
                return;
            }
            
            // 製品が選択されているかチェック
            const hasSelectedProducts = typeof selectedProducts !== 'undefined' && selectedProducts.length > 0;
            
            // 強度が選択されているかチェック
            const unitSelect = document.getElementById('selected-unit-display');
            const isUnitSelected = unitSelect && unitSelect.value && unitSelect.value !== '' && unitSelect.value !== '選択してください';
            
            // 製品と強度が選択されている場合のみモーダルを開く
            if (hasSelectedProducts && isUnitSelected) {
                showModal('quantity-input-modal');
                // モーダル表示時に初期化（生産指示画面用の情報を設定）
                initializeQuantityInputModalForProduction();
            } else {
                alert('製品と強度を選択してください。');
            }
        });
    }

    // 変更依頼ボタンのクリックイベント
    setupChangeRequestButtonEvents();
    
    // 注文数量変更ボタンのクリックイベント
    const changeOrderQuantityBtn = document.querySelector('.change-order-quantity-btn');
    if (changeOrderQuantityBtn) {
        changeOrderQuantityBtn.addEventListener('click', function() {
            // 選択された行があるかチェック
            const selectedRow = document.querySelector('#production-instruction-screen .batch-info-table tbody tr.selected-requested');
            if (!selectedRow) {
                alert('変更対象の行を選択してください。');
                return;
            }
            
            // モーダル表示時に初期化
            initializeChangeRequestModal(selectedRow);
            showModal('change-request-modal');
        });
    }
    
    // 打設完了ボタンのクリックイベント
    setupStatusButtonEvents();
    
    // モーダルのキャンセルボタン
    setupModalCancelButtonEvents();
    
    // モーダルの確定ボタン
    setupModalConfirmButtonEvents();
    
    // 数量入力モーダルのイベント設定
    setupQuantityInputModalEvents();
    
    // 打設順変更ボタンのイベント設定
    setupSortOrderButtonEvents();
}

// 変更依頼ボタンのイベント設定
function setupChangeRequestButtonEvents() {
    const changeRequestBtns = document.querySelectorAll('.change-request-btn');
    changeRequestBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            showModal('change-request-modal');
        });
    });
}

// 打設順変更ボタンのイベント設定
function setupSortOrderButtonEvents() {
    const sortBtn = document.querySelector('.sort-btn');
    if (sortBtn) {
        sortBtn.addEventListener('click', function() {
            // 打設順変更モードを開始
            if (typeof startSortOrderMode === 'function') {
                startSortOrderMode();
            }
        });
    }
}

// 打設完了ボタンのイベント設定（生産指示画面用）
function setupStatusButtonEvents() {
    // 生産指示画面の打設完了ボタン（静的に存在するもの）のイベント設定
    const statusBtns = document.querySelectorAll('#production-instruction-screen .status-btn');
    statusBtns.forEach(btn => {
        // 既存のイベントリスナーを削除
        const newBtn = btn.cloneNode(true);
        btn.parentNode.replaceChild(newBtn, btn);
        
        if (newBtn.classList.contains('status-completed')) {
            newBtn.addEventListener('click', function() {
                // 打設完了確認モーダルを表示
                const completionModal = document.querySelector('.completion-modal');
                if (completionModal) {
                    completionModal.style.display = 'flex';
                }
            });
        }
    });
}

// 注文画面の打設完了ボタンの処理
function handleOrderItemCompletion(btn, orderItem) {
    // データ属性から情報を取得
    const projectName = orderItem.getAttribute('data-project-name');
    const floor = orderItem.getAttribute('data-floor');
    const formworkNo = orderItem.getAttribute('data-formwork-no');
    const currentStatus = orderItem.getAttribute('data-pouring-status');
    
    if (!projectName || !floor || !formworkNo) {
        console.error('必要なデータ属性がありません');
        return;
    }
    
    // 打設完了確認モーダルを表示
    const completionModal = document.getElementById('completion-modal');
    if (completionModal) {
        // モーダルの内容を設定
        const formworkSpan = completionModal.querySelector('.completion-info .info-item:first-child span');
        const projectSpan = completionModal.querySelector('.completion-info .info-item:nth-child(2) span');
        const floorSpan = completionModal.querySelector('.completion-info .info-item:nth-child(3) span');
        const productIdSpan = completionModal.querySelector('.completion-info .info-item:last-child span');
        
        if (formworkSpan) formworkSpan.textContent = formworkNo;
        if (projectSpan) projectSpan.textContent = projectName;
        if (floorSpan) floorSpan.textContent = floor;
        if (productIdSpan) {
            // 製品番号はorder-itemから取得できないので、データから検索
            const productId = findProductIdFromOrderItem(orderItem);
            productIdSpan.textContent = productId || '-';
        }
        
        // モーダルを表示
        completionModal.style.display = 'flex';
        
        // モーダルの確定ボタンに、このorder-itemの情報を保存
        const confirmBtn = completionModal.querySelector('.modal-ok-btn');
        if (confirmBtn) {
            confirmBtn.setAttribute('data-order-item-project', projectName);
            confirmBtn.setAttribute('data-order-item-floor', floor);
            confirmBtn.setAttribute('data-order-item-formwork', formworkNo);
        }
    }
}

// order-itemから製品番号を検索
function findProductIdFromOrderItem(orderItem) {
    const projectName = orderItem.getAttribute('data-project-name');
    const floor = orderItem.getAttribute('data-floor');
    const formworkNo = orderItem.getAttribute('data-formwork-no');
    
    if (!projectName || !floor || !formworkNo) return '';
    
    // sharedScheduleDataから該当するデータを検索
    let foundProductId = '';
    Object.keys(sharedScheduleData).forEach(factory => {
        Object.keys(sharedScheduleData[factory]).forEach(line => {
            const projects = sharedScheduleData[factory][line];
            if (projects[projectName]) {
                const projectDataArray = projects[projectName];
                projectDataArray.forEach((data, index) => {
                    const dataFormworkNo = data.formworkNo || `No.${index + 1}`;
                    if (dataFormworkNo === formworkNo && data.floor === floor && data.id) {
                        foundProductId = data.id;
                    }
                });
            }
        });
    });
    
    return foundProductId;
}

// 注文画面からの打設完了ステータス更新
function updatePouringStatusFromOrderItem(projectName, floor, formworkNo) {
    // sharedScheduleDataから該当するデータを検索して更新
    Object.keys(sharedScheduleData).forEach(factory => {
        Object.keys(sharedScheduleData[factory]).forEach(line => {
            const projects = sharedScheduleData[factory][line];
            if (projects[projectName]) {
                const projectDataArray = projects[projectName];
                projectDataArray.forEach((data, index) => {
                    const dataFormworkNo = data.formworkNo || `No.${index + 1}`;
                    if (dataFormworkNo === formworkNo && data.floor === floor) {
                        // 打設完了ステータスを更新
                        data.pouringStatus = 'completed';
                    }
                });
            }
        });
    });
}

// モーダルキャンセルボタンのイベント設定
function setupModalCancelButtonEvents() {
    const modalCancelBtns = document.querySelectorAll('.modal-footer .modal-cancel-btn');
    modalCancelBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // 数量入力モーダルの場合はリセット
            if (btn.closest('#quantity-input-modal')) {
                resetQuantityInputModal();
            }
            // 数量変更依頼モーダルの場合、注文済みデータの変更依頼情報をクリア
            if (btn.closest('#change-request-modal')) {
                if (typeof currentOrderedDataChangeRequest !== 'undefined' && currentOrderedDataChangeRequest !== null) {
                    currentOrderedDataChangeRequest = null;
                }
            }
            // モーダルを閉じる
            hideModal('quantity-input-modal');
            hideModal('change-request-modal');
            hideModal('completion-modal');
        });
    });
}

// モーダル確定ボタンのイベント設定
function setupModalConfirmButtonEvents() {
    const modalConfirmBtns = document.querySelectorAll('.modal-footer .modal-change-request-btn, .modal-footer .completion-btn, .modal-footer .order-btn, .modal-footer .modal-order-concrete-btn, .modal-footer .modal-ok-btn');
    console.log('setupModalConfirmButtonEvents: 見つかったボタン数:', modalConfirmBtns.length);
    modalConfirmBtns.forEach((btn, index) => {
        console.log(`ボタン${index}:`, btn.className, btn.textContent);
        btn.addEventListener('click', function() {
            // 数量入力モーダルの場合
            if (btn.closest('#quantity-input-modal')) {
                // 注文ボタンの場合
                if (btn.classList.contains('order-btn')) {
                    // 総量が入力されているかチェック
                    const totalQuantityInput = document.getElementById('total-quantity-input');
                    if (!totalQuantityInput || !totalQuantityInput.value.trim()) {
                        alert('総量を入力してください。');
                        return;
                    }
                    const value = parseFloat(totalQuantityInput.value.trim());
                    if (isNaN(value) || value <= 0) {
                        alert('総量に有効な数値を入力してください。');
                        return;
                    }
                    
                    // 注文画面からの注文かどうかを確認
                    const quantityInputModal = document.getElementById('quantity-input-modal');
                    const isFromOrderScreen = quantityInputModal && quantityInputModal.getAttribute('data-from-order-screen') === 'true';
                    
                    if (isFromOrderScreen) {
                        // 注文画面からの注文の場合、確認ダイアログを表示
                        if (confirm('この内容で注文依頼を行います。よろしいですか？')) {
                            // OKした場合、注文時刻を保存して注文処理を実行
                            try {
                                handleOrderScreenOrderConfirm();
                            } catch (error) {
                                console.error('注文処理中にエラーが発生しました:', error);
                                // エラーが発生した場合でもモーダルを閉じる
                                resetQuantityInputModal();
                                hideModal('quantity-input-modal');
                            }
                        }
                        // キャンセルした場合は何もしない（モーダルを閉じない）
                        return;
                    } else {
                        // 生産指示画面からの注文の場合、確認ダイアログを表示
                        if (confirm('この内容で注文依頼を行います。よろしいですか？')) {
                            // OKした場合、注文処理を実行
                            handleProductionOrderConfirm();
                            // モーダルをリセットして閉じる
                            resetQuantityInputModal();
                            hideModal('quantity-input-modal');
                        }
                        // キャンセルした場合は何もしない（モーダルを閉じない）
                        return;
                    }
                }
                resetQuantityInputModal();
            }
            
            // 数量変更依頼モーダルの場合
            if (btn.closest('#change-request-modal')) {
                // 変更依頼ボタンの場合
                if (btn.classList.contains('modal-change-request-btn')) {
                    // 変更後の量が入力されているかチェック
                    const afterQuantityInput = document.querySelector('#change-request-modal .quantity-change:last-child input');
                    if (!afterQuantityInput || !afterQuantityInput.value.trim()) {
                        alert('変更後の量を入力してください。');
                        return;
                    }
                    const value = parseFloat(afterQuantityInput.value.trim());
                    if (isNaN(value) || value <= 0) {
                        alert('変更後の量に有効な数値を入力してください。');
                        return;
                    }
                    
                    // 確認ダイアログを表示
                    if (confirm('この数量で変更依頼をします。よろしいですか？')) {
                        // OKした場合、処理を実行
                        handleChangeRequestConfirm();
                        // モーダルを閉じる
                        hideModal('change-request-modal');
                    }
                    // キャンセルした場合は何もしない（モーダルを閉じない）
                    return;
                }
            }
            
            // 打設完了モーダルの場合
            if (btn.closest('#completion-modal')) {
                // 打設完了ボタンの場合、打設完了処理を実行
                if (btn.classList.contains('modal-ok-btn')) {
                    console.log('打設完了ボタンがクリックされました');
                    const completionResult = handleCompletionConfirm();
                    console.log('handleCompletionConfirmの戻り値:', completionResult);
                    // 処理が完了した場合のみモーダルを閉じる（キャンセルした場合は閉じない）
                    if (completionResult === false) {
                        console.log('打設完了処理がキャンセルされました');
                        return; // キャンセルした場合は何もしない（モーダルを閉じない）
                    }
                    // 処理が完了した場合、モーダルを閉じる
                    console.log('打設完了処理が完了しました。モーダルを閉じます');
                    hideModal('completion-modal');
                    return; // 他のモーダルを閉じる処理をスキップ
                }
            }
            
            // モーダルを閉じる
            hideModal('quantity-input-modal');
            hideModal('change-request-modal');
            hideModal('completion-modal');
        });
    });
}

// すべてのモーダルを閉じる関数
function closeAllModals() {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        modal.style.display = 'none';
    });
}

// モーダル表示制御関数
function showModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'flex';
    }
}

// モーダル非表示制御関数
function hideModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'none';
    }
}

// ========================================
// 数量入力モーダル - バッチ処理機能
// ========================================

// 注文ボタンの有効/無効を切り替える関数
function updateOrderButtonState() {
    const totalQuantityInput = document.getElementById('total-quantity-input');
    const orderBtn = document.querySelector('#quantity-input-modal .modal-footer .order-btn');
    
    if (!totalQuantityInput || !orderBtn) return;
    
    const value = totalQuantityInput.value.trim();
    // 数値が入力されているかチェック（空文字、NaN、0以下は無効）
    const isValid = value !== '' && !isNaN(parseFloat(value)) && parseFloat(value) > 0;
    
    orderBtn.disabled = !isValid;
}

// 数量入力モーダルの初期化
function initializeQuantityInputModal() {
    // バッチテーブルをクリア
    clearBatchTable();
    // 残り量を更新
    updateRemainingQuantity();
    // バッチ割ラジオボタンの状態を反映
    updateBatchInputsState();
    // 注文ボタンを無効化
    updateOrderButtonState();
}

// 注文画面用の数量入力モーダルの初期化
function initializeQuantityInputModalForOrder() {
    // 基本初期化
    initializeQuantityInputModal();
    
    // 注文画面からの注文であることを示すフラグを設定
    const quantityInputModal = document.getElementById('quantity-input-modal');
    if (quantityInputModal) {
        quantityInputModal.setAttribute('data-from-order-screen', 'true');
    }
    
    // チェックされたチェックボックスを取得
    const checkedCheckboxes = document.querySelectorAll('#order-grid .concrete-option input[type="checkbox"]:checked');
    if (checkedCheckboxes.length === 0) {
        return;
    }
    
    // 全てのチェックされたチェックボックスの情報を収集
    const checkedItems = [];
    checkedCheckboxes.forEach(checkbox => {
        const orderItem = checkbox.closest('.order-item');
        if (!orderItem) return;
        
        const projectName = orderItem.getAttribute('data-project-name');
        const floor = orderItem.getAttribute('data-floor');
        const formworkNo = orderItem.getAttribute('data-formwork-no');
        const factory = orderItem.getAttribute('data-factory');
        const line = orderItem.getAttribute('data-line');
        const unit = checkbox.getAttribute('data-unit');
        
        if (projectName && floor && formworkNo && factory && line && unit) {
            checkedItems.push({
                projectName: projectName,
                floor: floor,
                formworkNo: formworkNo,
                factory: factory,
                line: line,
                unit: unit
            });
        }
    });
    
    // チェックされたアイテムの情報をモーダルに保存（注文時刻保存時に使用）
    if (quantityInputModal && checkedItems.length > 0) {
        quantityInputModal.setAttribute('data-checked-items', JSON.stringify(checkedItems));
        
        // 最初のアイテムの情報も個別に保存（表示用・後方互換性のため）
        const firstItem = checkedItems[0];
        quantityInputModal.setAttribute('data-order-item-project', firstItem.projectName || '');
        quantityInputModal.setAttribute('data-order-item-floor', firstItem.floor || '');
        quantityInputModal.setAttribute('data-order-item-formwork', firstItem.formworkNo || '');
        quantityInputModal.setAttribute('data-order-item-factory', firstItem.factory || '');
        quantityInputModal.setAttribute('data-order-item-line', firstItem.line || '');
        quantityInputModal.setAttribute('data-order-item-unit', firstItem.unit || '');
    }
    
    // チェックされたunitのvalue総量を計算（最初のunitの総量を計算）
    let totalValue = 0;
    const firstUnit = checkedItems.length > 0 ? checkedItems[0].unit : '';
    checkedCheckboxes.forEach(checkbox => {
        const checkboxUnit = checkbox.getAttribute('data-unit');
        if (checkboxUnit === firstUnit) {
            // checkboxの親要素からvalueを取得
            const label = checkbox.closest('label');
            if (label) {
                const span = label.querySelector('span');
                if (span) {
                    // "60N 5.5㎥" のような形式から数値を抽出
                    const text = span.textContent.trim();
                    const match = text.match(/(\d+\.?\d*)\s*㎥/);
                    if (match) {
                        totalValue += parseFloat(match[1]);
                    }
                }
            }
        }
    });
    
    // project-info-headerを更新
    const projectInfoName = document.querySelector('#quantity-input-modal .project-info-name');
    const concreteInfo = document.querySelector('#quantity-input-modal .concrete-info');
    
    if (projectInfoName && checkedItems.length > 0) {
        projectInfoName.textContent = checkedItems[0].projectName || '';
    }
    
    if (concreteInfo && firstUnit) {
        concreteInfo.textContent = `${firstUnit} ${totalValue.toFixed(2)}㎥`;
    }
    
    // line-selectorから工場情報を取得
    const lineSelector = document.querySelector('.line-selector');
    let factory = null;
    if (lineSelector) {
        const selectedOption = lineSelector.options[lineSelector.selectedIndex];
        const lineText = selectedOption ? selectedOption.text : '';
        
        if (lineText.startsWith('栃木_')) {
            factory = 'tochigi-factory';
        } else if (lineText.startsWith('茨城_')) {
            factory = 'ibaraki-factory';
        }
    }
    
    // batch-mode-selectionのラジオボタンを設定
    const batchModeAuto = document.getElementById('batch-mode-auto');
    const batchModeManual = document.getElementById('batch-mode-manual');
    
    if (batchModeAuto && batchModeManual) {
        if (factory === 'tochigi-factory') {
            // 栃木工場なら自動分割
            batchModeAuto.checked = true;
            batchModeManual.checked = false;
        } else if (factory === 'ibaraki-factory') {
            // 茨城工場なら手動入力
            batchModeAuto.checked = false;
            batchModeManual.checked = true;
        }
    }
}

// 生産指示画面用の数量入力モーダルの初期化
function initializeQuantityInputModalForProduction() {
    // 基本初期化
    initializeQuantityInputModal();
    
    // h3を「注文数量入力」に設定
    const modalHeaderH3 = document.querySelector('#quantity-input-modal .modal-header h3');
    if (modalHeaderH3) {
        modalHeaderH3.textContent = '注文数量入力';
    }
    
    // project-info-headerを更新（物件略称、強度、合計数量を表示）
    const projectInfoName = document.querySelector('#quantity-input-modal .project-info-name');
    const concreteInfo = document.querySelector('#quantity-input-modal .concrete-info');
    
    // 物件略称を取得（選択している製品のプロジェクト名）
    let projectName = '';
    if (typeof selectedProducts !== 'undefined' && selectedProducts.length > 0 && selectedProducts[0].cell) {
        const projectSection = selectedProducts[0].cell.closest('.project-section');
        if (projectSection) {
            const projectNameElement = projectSection.querySelector('.project-name');
            if (projectNameElement) {
                projectName = projectNameElement.textContent.trim();
            }
        }
    }
    
    // 強度を取得（selected-unit-displayの値）
    const unitSelect = document.getElementById('selected-unit-display');
    const strength = unitSelect && unitSelect.value && unitSelect.value !== '' && unitSelect.value !== '選択してください' 
        ? unitSelect.value 
        : '';
    
    // 合計数量を取得（selected-strengthの値）
    const selectedStrengthElement = document.getElementById('selected-strength');
    const totalQuantity = selectedStrengthElement && selectedStrengthElement.textContent.trim() 
        ? parseFloat(selectedStrengthElement.textContent.trim()) 
        : 0;
    
    // project-info-nameに物件略称を表示
    if (projectInfoName) {
        projectInfoName.textContent = projectName || '';
    }
    
    // concrete-infoに強度と合計数量を表示
    if (concreteInfo) {
        if (strength && totalQuantity > 0) {
            concreteInfo.textContent = `${strength} ${totalQuantity.toFixed(2)}㎥`;
        } else if (strength) {
            concreteInfo.textContent = strength;
        } else {
            concreteInfo.textContent = '';
        }
    }
    
    // 3, 4. batch-select-tableの選択状態を取得してラジオボタンを設定
    const batchSelectTable = document.querySelector('.batch-select-table');
    if (batchSelectTable) {
        // おまかせのチェックボックス（最初のtr）
        const autoCheckbox = batchSelectTable.querySelector('tr:first-child input[type="checkbox"]');
        // 指定のチェックボックス（2番目のtr）
        const manualCheckbox = batchSelectTable.querySelector('tr:last-child input[type="checkbox"]');
        
        const batchDivisionAuto = document.getElementById('batch-division-auto');
        const batchDivisionManual = document.getElementById('batch-division-manual');
        
        if (autoCheckbox && manualCheckbox && batchDivisionAuto && batchDivisionManual) {
            if (autoCheckbox.checked) {
                batchDivisionAuto.checked = true;
            } else if (manualCheckbox.checked) {
                batchDivisionManual.checked = true;
            }
            // 状態を更新
            updateBatchInputsState();
        }
    }
}

// 数量入力モーダルのリセット
function resetQuantityInputModal() {
    // 入力フィールドをリセット
    const totalQuantityInput = document.getElementById('total-quantity-input');
    if (totalQuantityInput) {
        totalQuantityInput.value = '';
    }
    
    const batchSizeInput = document.getElementById('batch-size-input');
    if (batchSizeInput) {
        batchSizeInput.value = '';
    }
    
    const memoTextarea = document.getElementById('memo-textarea');
    if (memoTextarea) {
        memoTextarea.value = '';
    }
    
    // バッチテーブルをクリア
    clearBatchTable();
    
    // ラジオボタンをデフォルトに戻す
    const batchDivisionAuto = document.getElementById('batch-division-auto');
    if (batchDivisionAuto) {
        batchDivisionAuto.checked = true;
    }
    
    const batchModeAuto = document.getElementById('batch-mode-auto');
    if (batchModeAuto) {
        batchModeAuto.checked = true;
    }
    
    // h3を元に戻す
    const modalHeaderH3 = document.querySelector('#quantity-input-modal .modal-header h3');
    if (modalHeaderH3) {
        modalHeaderH3.textContent = '注文数量入力';
    }
    
    // 注文画面からの注文フラグをクリア
    const quantityInputModal = document.getElementById('quantity-input-modal');
    if (quantityInputModal) {
        quantityInputModal.removeAttribute('data-from-order-screen');
        quantityInputModal.removeAttribute('data-checked-items');
        quantityInputModal.removeAttribute('data-order-item-project');
        quantityInputModal.removeAttribute('data-order-item-floor');
        quantityInputModal.removeAttribute('data-order-item-formwork');
        quantityInputModal.removeAttribute('data-order-item-factory');
        quantityInputModal.removeAttribute('data-order-item-line');
        quantityInputModal.removeAttribute('data-order-item-unit');
    }
    
    // 状態を更新
    updateBatchInputsState();
    updateRemainingQuantity();
    // 注文ボタンを無効化
    updateOrderButtonState();
}

// 数量入力モーダルのイベント設定
function setupQuantityInputModalEvents() {
    // バッチ割ラジオボタンの変更イベント
    const batchDivisionRadios = document.querySelectorAll('input[name="batch-division"]');
    batchDivisionRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            updateBatchInputsState();
        });
    });
    
    // 追加ボタンのクリックイベント
    const batchAddBtn = document.getElementById('batch-add-btn');
    if (batchAddBtn) {
        batchAddBtn.addEventListener('click', function() {
            handleBatchAdd();
        });
    }
    
    // 総量入力の変更イベント
    const totalQuantityInput = document.getElementById('total-quantity-input');
    if (totalQuantityInput) {
        totalQuantityInput.addEventListener('input', function() {
            updateRemainingQuantity();
            // 注文ボタンの有効/無効を更新
            updateOrderButtonState();
        });
    }
}

// バッチ割ラジオボタンの状態に応じてbatch-inputsを有効/無効化
function updateBatchInputsState() {
    const batchDivisionAuto = document.getElementById('batch-division-auto');
    const batchInputsSection = document.getElementById('batch-inputs-section');
    const batchAddBtn = document.getElementById('batch-add-btn');
    
    if (batchDivisionAuto && batchInputsSection && batchAddBtn) {
        if (batchDivisionAuto.checked) {
            // おまかせ選択時はグレーアウト
            batchInputsSection.classList.add('disabled');
            batchAddBtn.disabled = true;
        } else {
            // 指定選択時は有効化
            batchInputsSection.classList.remove('disabled');
            batchAddBtn.disabled = false;
        }
    }
}

// バッチ追加処理
function handleBatchAdd() {
    const batchSizeInput = document.getElementById('batch-size-input');
    const batchModeAuto = document.getElementById('batch-mode-auto');
    const batchModeManual = document.getElementById('batch-mode-manual');
    
    if (!batchSizeInput || !batchModeAuto || !batchModeManual) return;
    
    const batchSize = parseFloat(batchSizeInput.value);
    if (isNaN(batchSize) || batchSize <= 0) {
        alert('1バッチ量を正しく入力してください。');
        return;
    }
    
    if (batchModeAuto.checked) {
        handleAutoBatchDivision(batchSize);
    } else if (batchModeManual.checked) {
        handleManualBatchDivision(batchSize);
    }
}

// 自動分割処理
function handleAutoBatchDivision(batchSize) {
    const totalQuantityInput = document.getElementById('total-quantity-input');
    if (!totalQuantityInput) return;
    
    // 総量から㎥数を取得（例: "1.348㎥" から "1.348" を抽出）
    const totalQuantityText = totalQuantityInput.value;
    const volumeMatch = totalQuantityText.match(/(\d+\.?\d*)/);
    if (!volumeMatch) {
        alert('総量を正しく入力してください。');
        return;
    }
    
    const totalVolume = parseFloat(volumeMatch[1]);
    
    // 既存のバッチリストをクリア
    clearBatchTable();
    
    // 最初に1バッチ量が総量より大きい場合はエラー
    if (batchSize > totalVolume) {
        alert(`エラー: 1バッチ量(${batchSize}㎥)が総量(${totalVolume}㎥)より大きいです。`);
        return;
    }
    
    // 残り量を追跡しながらバッチを生成
    let remainingVolume = totalVolume;
    let batchNumber = 1;
    
    while (remainingVolume > 0) {
        // バッチ量を決定（残りが1バッチ量より小さい場合は残り全部）
        const currentBatchSize = Math.min(batchSize, remainingVolume);
        
        // 浮動小数点の計算誤差を修正
        const roundedBatchSize = Math.round(currentBatchSize * 1000) / 1000;
        
        // バッチを追加
        addBatchToTable(batchNumber, roundedBatchSize);
        
        // 残り量を更新（計算誤差を修正）
        remainingVolume = Math.round((remainingVolume - roundedBatchSize) * 1000) / 1000;
        batchNumber++;
    }
    
    // 残り量を更新
    updateRemainingQuantity();
}

// 手動入力処理
function handleManualBatchDivision(batchSize) {
    // 現在のバッチ数を取得して次のバッチNoを決定
    const nextBatchNumber = getNextBatchNumber();
    
    // 1行追加
    addBatchToTable(nextBatchNumber, batchSize);
    
    // 残り量を更新
    updateRemainingQuantity();
}

// バッチテーブルに追加
function addBatchToTable(batchNumber, volume) {
    const batchTableBody = document.getElementById('batch-table-body');
    if (!batchTableBody) return;
    
    const row = document.createElement('tr');
    row.innerHTML = `
        <td>${batchNumber}</td>
        <td>
            <input type="text" class="batch-volume-input" value="${volume.toFixed(2)}" data-original-value="${volume.toFixed(2)}">
        </td>
        <td>
            <button class="delete-btn">×</button>
        </td>
    `;
    
    batchTableBody.appendChild(row);
    
    // ㎥数入力の変更イベントを設定
    const volumeInput = row.querySelector('.batch-volume-input');
    if (volumeInput) {
        volumeInput.addEventListener('input', function() {
            updateRemainingQuantity();
        });
    }
    
    // 削除ボタンのイベントを設定
    const deleteBtn = row.querySelector('.delete-btn');
    if (deleteBtn) {
        deleteBtn.addEventListener('click', function() {
            removeBatchRow(this);
        });
    }
}

// バッチテーブルをクリア
function clearBatchTable() {
    const batchTableBody = document.getElementById('batch-table-body');
    if (batchTableBody) {
        batchTableBody.innerHTML = '';
    }
    updateRemainingQuantity();
}

// 次のバッチNoを取得
function getNextBatchNumber() {
    const batchTableBody = document.getElementById('batch-table-body');
    if (!batchTableBody) return 1;
    
    const rows = batchTableBody.querySelectorAll('tr');
    return rows.length + 1;
}

// バッチNoを振り直す
function renumberBatchTable() {
    const batchTableBody = document.getElementById('batch-table-body');
    if (!batchTableBody) return;
    
    const rows = batchTableBody.querySelectorAll('tr');
    rows.forEach((row, index) => {
        const batchNoCell = row.querySelector('td:first-child');
        if (batchNoCell) {
            batchNoCell.textContent = index + 1;
        }
    });
}

// バッチ行を削除
function removeBatchRow(button) {
    const row = button.closest('tr');
    if (row) {
        row.remove();
        // バッチNoを振り直す
        renumberBatchTable();
        // 残り量を更新
        updateRemainingQuantity();
    }
}

// 残り量を更新
function updateRemainingQuantity() {
    const totalQuantityInput = document.getElementById('total-quantity-input');
    const remainingDisplay = document.getElementById('remaining-quantity-display');
    
    if (!totalQuantityInput || !remainingDisplay) return;
    
    // 総量を取得
    const totalQuantityText = totalQuantityInput.value;
    const volumeMatch = totalQuantityText.match(/(\d+\.?\d*)/);
    if (!volumeMatch) {
        remainingDisplay.textContent = '-';
        return;
    }
    
    const totalVolume = parseFloat(volumeMatch[1]);
    
    // 追加済みのバッチの合計を計算
    const batchTableBody = document.getElementById('batch-table-body');
    let totalBatchVolume = 0;
    
    if (batchTableBody) {
        const volumeInputs = batchTableBody.querySelectorAll('.batch-volume-input');
        volumeInputs.forEach(input => {
            const volume = parseFloat(input.value);
            if (!isNaN(volume) && volume > 0) {
                totalBatchVolume += volume;
            }
        });
    }
    
    // 残り量を計算（計算誤差を修正）
    const remaining = Math.round((totalVolume - totalBatchVolume) * 1000) / 1000;
    remainingDisplay.textContent = remaining >= 0 ? remaining.toFixed(2) : '0.00';
}

// 小数点桁数を取得する関数
function getDecimalPlaces(num) {
    const str = num.toString();
    if (str.indexOf('.') === -1) {
        return 0;
    }
    return str.split('.')[1].length;
}

// divとspan2つに値が入っているかチェックする関数
function checkRequiredValuesPresent() {
    // 注文内容入力エリアの設計数量の値をチェック
    const strengthDisplayRow = document.querySelector('.order-input-area .strength-display-row span');
    const unitDisplaySpans = document.querySelectorAll('.order-input-area .unit-display-row span');
    
    // strength-display-rowに値があるかチェック
    if (!strengthDisplayRow || !strengthDisplayRow.textContent.trim()) {
        return false;
    }
    
    // unit-display-rowの2つのspanに値があるかチェック
    if (unitDisplaySpans.length < 2) {
        return false;
    }
    
    const firstSpanValue = unitDisplaySpans[0].textContent.trim();
    const secondSpanValue = unitDisplaySpans[1].textContent.trim();
    
    if (!firstSpanValue || !secondSpanValue) {
        return false;
    }
    
    return true;
}

// ========================================
// 数量変更依頼モーダル - 初期化処理
// ========================================

// 数量変更依頼モーダルの初期化
function initializeChangeRequestModal(selectedRow) {
    // 選択された行のm3数を取得（2列目のtdから取得）
    const m3Cell = selectedRow.querySelector('td:nth-child(2)');
    if (!m3Cell) {
        console.error('m3数のセルが見つかりません');
        return;
    }
    
    const m3Value = m3Cell.textContent.trim();
    // m3数から数値部分を抽出（単位を除く）
    const m3Number = parseFloat(m3Value.replace(/[m³㎥]/g, '')) || 0;
    
    // change-request-modal内のquantity-change span（変更前の量を表示するspan）にm3数を設定
    const quantityChangeSpan = document.querySelector('#change-request-modal .quantity-change:first-child span');
    if (quantityChangeSpan) {
        // m3数を小数点第2位まで表示
        quantityChangeSpan.textContent = m3Number.toFixed(2) + 'm³';
    } else {
        console.error('quantity-change spanが見つかりません');
    }
    
    // 変更後の量のinputに変更前の量をデフォルト値として設定
    const afterQuantityInput = document.querySelector('#change-request-modal .quantity-change:last-child input');
    if (afterQuantityInput) {
        // 既存のイベントリスナーを削除（重複防止のため）
        const newInput = afterQuantityInput.cloneNode(true);
        afterQuantityInput.parentNode.replaceChild(newInput, afterQuantityInput);
        
        // デフォルト値を小数点第2位まで設定
        newInput.value = m3Number.toFixed(2);
        newInput.placeholder = '0.00';
        
        // 入力値の変更を監視して、ボタンの有効/無効を切り替え
        newInput.addEventListener('input', function() {
            updateChangeRequestButtonState();
        });
        
        // 初期状態でボタンの有効/無効を設定
        updateChangeRequestButtonState();
    }
}

// 注文済みデータ用の数量変更依頼モーダルの初期化
let currentOrderedDataChangeRequest = null;

// 変更依頼ボタンの有効/無効を更新する関数
function updateChangeRequestButtonState() {
    const afterQuantityInput = document.querySelector('#change-request-modal .quantity-change:last-child input');
    const changeRequestBtn = document.querySelector('#change-request-modal .modal-change-request-btn');
    
    if (afterQuantityInput && changeRequestBtn) {
        const value = afterQuantityInput.value.trim();
        if (value === '' || value === null || value === undefined) {
            changeRequestBtn.disabled = true;
        } else {
            const numValue = parseFloat(value);
            if (isNaN(numValue) || numValue <= 0) {
                changeRequestBtn.disabled = true;
            } else {
                changeRequestBtn.disabled = false;
            }
        }
    }
}

function initializeChangeRequestModalForOrderedData(data) {
    currentOrderedDataChangeRequest = data;
    
    // 変更対象の表示を更新
    const changeTarget = document.querySelector('#change-request-modal .change-target');
    if (changeTarget) {
        changeTarget.textContent = `${data.project} ${data.strength}`;
    }
    
    // 変更前の量を設定（小数点第2位まで表示）
    const quantityChangeSpan = document.querySelector('#change-request-modal .quantity-change:first-child span');
    if (quantityChangeSpan) {
        const batchVolume = parseFloat(data.batchVolume) || 0;
        quantityChangeSpan.textContent = `${batchVolume.toFixed(2)}㎥`;
    }
    
    // 変更後の量のinputに変更前の量をデフォルト値として設定
    const afterQuantityInput = document.querySelector('#change-request-modal .quantity-change:last-child input');
    if (afterQuantityInput) {
        // 既存のイベントリスナーを削除（重複防止のため）
        const newInput = afterQuantityInput.cloneNode(true);
        afterQuantityInput.parentNode.replaceChild(newInput, afterQuantityInput);
        
        // デフォルト値を小数点第2位まで設定
        const batchVolume = parseFloat(data.batchVolume) || 0;
        newInput.value = batchVolume.toFixed(2);
        newInput.placeholder = '0.00';
        
        // 入力値の変更を監視して、ボタンの有効/無効を切り替え
        newInput.addEventListener('input', function() {
            updateChangeRequestButtonState();
        });
        
        // 初期状態でボタンの有効/無効を設定
        updateChangeRequestButtonState();
    }
}

// ========================================
// 注文画面からの注文確定処理
// ========================================

// 注文画面からの注文確定時の処理
function handleOrderScreenOrderConfirm() {
    // 現在時刻を取得（HH:MM形式）
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const orderTime = `${hours}:${minutes}`;
    
    // モーダルから注文情報を取得
    const quantityInputModal = document.getElementById('quantity-input-modal');
    if (!quantityInputModal) {
        console.error('数量入力モーダルが見つかりません');
        return;
    }
    
    // チェックされた全てのアイテムの情報を取得
    const checkedItemsJson = quantityInputModal.getAttribute('data-checked-items');
    let checkedItems = [];
    
    if (checkedItemsJson) {
        try {
            checkedItems = JSON.parse(checkedItemsJson);
        } catch (e) {
            console.error('チェックされたアイテムの情報の解析に失敗しました', e);
            // 後方互換性のため、個別の属性から情報を取得
            const projectName = quantityInputModal.getAttribute('data-order-item-project');
            const floor = quantityInputModal.getAttribute('data-order-item-floor');
            const formworkNo = quantityInputModal.getAttribute('data-order-item-formwork');
            const factory = quantityInputModal.getAttribute('data-order-item-factory');
            const line = quantityInputModal.getAttribute('data-order-item-line');
            const unit = quantityInputModal.getAttribute('data-order-item-unit');
            
            if (projectName && floor && formworkNo && factory && line && unit) {
                checkedItems = [{
                    projectName: projectName,
                    floor: floor,
                    formworkNo: formworkNo,
                    factory: factory,
                    line: line,
                    unit: unit
                }];
            }
        }
    } else {
        // 後方互換性のため、個別の属性から情報を取得
        const projectName = quantityInputModal.getAttribute('data-order-item-project');
        const floor = quantityInputModal.getAttribute('data-order-item-floor');
        const formworkNo = quantityInputModal.getAttribute('data-order-item-formwork');
        const factory = quantityInputModal.getAttribute('data-order-item-factory');
        const line = quantityInputModal.getAttribute('data-order-item-line');
        const unit = quantityInputModal.getAttribute('data-order-item-unit');
        
        if (projectName && floor && formworkNo && factory && line && unit) {
            checkedItems = [{
                projectName: projectName,
                floor: floor,
                formworkNo: formworkNo,
                factory: factory,
                line: line,
                unit: unit
            }];
        }
    }
    
    if (checkedItems.length === 0) {
        console.error('注文情報が不完全です');
        return;
    }
    
    // 全てのチェックされたアイテムに対して注文時刻を保存
    checkedItems.forEach(item => {
        const { projectName, floor, formworkNo, factory, line, unit } = item;
        
        if (!projectName || !factory || !line || !floor || !formworkNo || !unit) {
            console.warn('不完全なアイテム情報をスキップ:', item);
            return;
        }
        
        // sharedScheduleDataに注文時刻を保存
        if (sharedScheduleData[factory] && sharedScheduleData[factory][line]) {
            const projects = sharedScheduleData[factory][line];
            if (projects[projectName]) {
                const projectDataArray = projects[projectName];
                let found = false;
                projectDataArray.forEach((data, index) => {
                    const dataFormworkNo = data.formworkNo || `No.${index + 1}`;
                    // 型枠番号と階数が一致するデータを探す
                    if (dataFormworkNo === formworkNo && data.floor === floor) {
                        // 注文時刻を保存（unitが一致する場合のみ）
                        if (data.unit && Array.isArray(data.unit)) {
                            const unitIndex = data.unit.findIndex(u => u === unit);
                            if (unitIndex !== -1) {
                                // 注文時刻を保存するためのプロパティを追加
                                if (!data.orderTimes) {
                                    data.orderTimes = {};
                                }
                                
                                // 既存の注文時刻を取得（order-data.jsからも確認）
                                let existingOrderTimes = [];
                                
                                // sharedScheduleDataに既存の注文時刻がある場合
                                if (data.orderTimes[unit]) {
                                    const existing = data.orderTimes[unit];
                                    if (Array.isArray(existing)) {
                                        existingOrderTimes = [...existing];
                                    } else {
                                        existingOrderTimes = [existing];
                                    }
                                }
                                
                                // order-data.jsに既存の注文データがある場合、その注文時刻も追加
                                // ただし、既に配列に含まれていない場合のみ
                                if (typeof findOrderDataById === 'function' && data.id) {
                                    const orderDataEntry = findOrderDataById(data.id, factory, line);
                                    if (orderDataEntry && orderDataEntry.order) {
                                        const order = orderDataEntry.order;
                                        // order-data.jsのstrengthとunitが一致する場合
                                        if (order.strength === unit && order.time) {
                                            // 既に配列に含まれていない場合のみ追加
                                            if (!existingOrderTimes.includes(order.time)) {
                                                existingOrderTimes.push(order.time);
                                            }
                                        }
                                    }
                                }
                                
                                // 新しい注文時刻を追加（既に含まれていない場合のみ）
                                if (!existingOrderTimes.includes(orderTime)) {
                                    existingOrderTimes.push(orderTime);
                                }
                                
                                // 配列として保存
                                data.orderTimes[unit] = existingOrderTimes;
                                found = true;
                                console.log('注文時刻を保存しました:', {
                                    factory,
                                    line,
                                    projectName,
                                    floor,
                                    formworkNo,
                                    unit,
                                    orderTimes: existingOrderTimes
                                });
                            }
                        }
                    }
                });
                if (!found) {
                    console.warn('注文時刻を保存するデータが見つかりませんでした:', {
                        factory,
                        line,
                        projectName,
                        floor,
                        formworkNo,
                        unit
                    });
                }
            } else {
                console.warn('プロジェクトが見つかりませんでした:', {
                    factory,
                    line,
                    projectName
                });
            }
        } else {
            console.warn('factoryまたはlineが見つかりませんでした:', {
                factory,
                line,
                hasFactory: !!sharedScheduleData[factory],
                hasLine: !!(sharedScheduleData[factory] && sharedScheduleData[factory][line])
            });
        }
    });
    
    // モーダルを閉じる
    resetQuantityInputModal();
    hideModal('quantity-input-modal');
    
    // 注文画面を更新
    if (typeof updateOrderItems === 'function') {
        updateOrderItems();
    }
}

// ========================================
// 生産指示画面からの注文確定処理
// ========================================

// 生産指示画面からの注文確定時の処理
function handleProductionOrderConfirm() {
    // 総量入力を取得
    const totalQuantityInput = document.getElementById('total-quantity-input');
    if (!totalQuantityInput) {
        console.error('総量入力欄が見つかりません');
        return;
    }
    
    const totalQuantityText = totalQuantityInput.value.trim();
    const totalQuantity = parseFloat(totalQuantityText) || 0;
    
    // lineOrderDetailsDataに注文を追加
    if (typeof selectedProducts === 'undefined' || selectedProducts.length === 0) {
        console.warn('選択されている製品がありません');
        return;
    }
    
    // ライン名を取得
    const lineSelector = document.getElementById('production-instruction-line-selector');
    if (!lineSelector) {
        console.error('ラインセレクターが見つかりません');
        return;
    }
    const selectedLine = lineSelector.value;
    
    // ライン名から工場を特定
    let factory = null;
    if (selectedLine.startsWith('栃木_')) {
        factory = 'tochigi-factory';
    } else if (selectedLine.startsWith('茨城_')) {
        factory = 'ibaraki-factory';
    }
    
    if (!factory || typeof lineOrderDetailsData === 'undefined' || !lineOrderDetailsData[factory]) {
        console.error('工場データが見つかりません');
        return;
    }
    
    // ラインのデータが存在しない場合は初期化
    if (!lineOrderDetailsData[factory][selectedLine]) {
        lineOrderDetailsData[factory][selectedLine] = [];
    }
    
    // プロジェクト名を取得
    let projectName = '';
    if (selectedProducts[0].cell) {
        const projectSection = selectedProducts[0].cell.closest('.project-section');
        if (projectSection) {
            const projectNameElement = projectSection.querySelector('.project-name');
            if (projectNameElement) {
                projectName = projectNameElement.textContent.trim();
            }
        }
    }
    
    // 製品IDを取得（複数ある場合はスペース区切り）
    const productIds = selectedProducts.map(p => p.id).filter(id => id && id.trim() !== '');
    const id = productIds.join(' ');
    
    // orderNoを生成（複数ある場合は「No1 No2」形式）
    const orderNos = productIds.map((_, index) => `No${index + 1}`);
    const orderNo = orderNos.join(' ');
    
    // 現在時刻を取得（HH:MM形式）
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const time = `${hours}:${minutes}`;
    
    // 強度を取得
    const unitSelect = document.getElementById('selected-unit-display');
    const strength = unitSelect && unitSelect.value && unitSelect.value !== '' && unitSelect.value !== '選択してください' 
        ? unitSelect.value 
        : '';
    
    // 調合No（mixNo）を取得
    let mixNo = '';
    if (unitSelect && unitSelect.selectedIndex >= 0) {
        const selectedOption = unitSelect.options[unitSelect.selectedIndex];
        if (selectedOption) {
            mixNo = selectedOption.getAttribute('data-mixing-no') || '';
        }
    }
    
    // 設計数量（m3）を取得
    const selectedStrengthElement = document.getElementById('selected-strength');
    const m3 = selectedStrengthElement && selectedStrengthElement.textContent.trim() 
        ? parseFloat(selectedStrengthElement.textContent.trim()) 
        : 0;
    
    // バッチ割の選択状態を取得
    const batchDivisionAuto = document.getElementById('batch-division-auto');
    const batchDivisionManual = document.getElementById('batch-division-manual');
    let batchRule = '';
    if (batchDivisionManual && batchDivisionManual.checked) {
        batchRule = '指定';
    } else if (batchDivisionAuto && batchDivisionAuto.checked) {
        batchRule = 'おまかせ';
    }
    
    // 新しい注文オブジェクトを作成
    const newOrder = {
        id: id,
        time: time,
        line: selectedLine,
        project: projectName,
        orderNo: orderNo,
        unloadingNo: '',
        formworkNo: '',
        strength: strength,
        mixNo: mixNo,
        m3: m3,
        volume: totalQuantity,
        batcher: '',
        batchStatus: 'バッチ割前',
        batchRule: batchRule,
        message: '',
        wetQuantity: 0,
        batches: []
    };
    
    // lineOrderDetailsDataに追加
    lineOrderDetailsData[factory][selectedLine].push(newOrder);
    
    // 注文明細テーブルを更新
    if (typeof updateOrderDetailsTable === 'function') {
        updateOrderDetailsTable(selectedLine);
    }
    
    // 選択した製品を選択解除
    if (typeof clearAllProductionSelections === 'function') {
        clearAllProductionSelections();
    }
}

// ========================================
// 打設完了モーダルの確定処理
// ========================================

// 打設完了モーダルの確定時の処理
// 戻り値: true = 処理完了、false = キャンセル
function handleCompletionConfirm() {
    console.log('handleCompletionConfirmが呼ばれました');
    // 注文画面からの打設完了の場合
    const confirmBtn = document.querySelector('#completion-modal .modal-ok-btn');
    console.log('confirmBtn:', confirmBtn);
    console.log('data-order-item-project属性:', confirmBtn ? confirmBtn.hasAttribute('data-order-item-project') : 'confirmBtnが見つかりません');
    
    if (confirmBtn && confirmBtn.hasAttribute('data-order-item-project')) {
        const projectName = confirmBtn.getAttribute('data-order-item-project');
        const floor = confirmBtn.getAttribute('data-order-item-floor');
        const formworkNo = confirmBtn.getAttribute('data-order-item-formwork');
        
        console.log('注文画面からの打設完了:', { projectName, floor, formworkNo });
        
        // 製品番号を取得（確認メッセージ用）
        const productIdSpan = document.querySelector('#completion-modal .completion-info .info-item:last-child span');
        const productId = productIdSpan ? productIdSpan.textContent.trim() : '';
        
        console.log('製品番号:', productId);
        
        // 確認メッセージを表示
        const message = productId ? 
            `この製品（${productId}）の打設を完了します。よろしいですか？` : 
            'この製品の打設を完了します。よろしいですか？';
        
        console.log('確認メッセージを表示します:', message);
        const confirmed = confirm(message);
        console.log('確認結果:', confirmed);
        
        if (!confirmed) {
            // キャンセルした場合はfalseを返す（モーダルを閉じない）
            console.log('ユーザーがキャンセルしました');
            return false;
        }
        
        // OKした場合、sharedScheduleDataから該当するデータを検索して更新
        updatePouringStatusFromOrderItem(projectName, floor, formworkNo);
        
        // データ属性をクリア
        confirmBtn.removeAttribute('data-order-item-project');
        confirmBtn.removeAttribute('data-order-item-floor');
        confirmBtn.removeAttribute('data-order-item-formwork');
        
        // 画面表示を更新
        if (typeof updateOrderItems === 'function') {
            updateOrderItems();
        }
        
        return true; // 処理完了
    }
    
    // 生産指示画面からの打設完了の場合
    // 選択されている製品があるかチェック
    if (typeof selectedProducts === 'undefined' || selectedProducts.length === 0) {
        console.error('選択されている製品がありません');
        return true; // エラーでもモーダルは閉じる
    }
    
    // 製品番号を取得（確認メッセージ用）
    const productIdSpan = document.querySelector('#completion-modal .completion-info .info-item:last-child span');
    const productId = productIdSpan ? productIdSpan.textContent.trim() : '';
    
    // 確認メッセージを表示
    const message = productId && productId !== '-' ? 
        `この製品（${productId}）の打設を完了します。よろしいですか？` : 
        'この製品の打設を完了します。よろしいですか？';
    
    const confirmed = confirm(message);
    
    if (!confirmed) {
        // キャンセルした場合はfalseを返す（モーダルを閉じない）
        return false;
    }
    
    // 各選択製品に対して打設完了ステータスを更新
    selectedProducts.forEach(product => {
        if (product.cell) {
            // セルから情報を取得
            const scheduleRow = product.cell.closest('.schedule-row');
            const projectSection = product.cell.closest('.project-section');
            
            if (!scheduleRow || !projectSection) return;
            
            // 型枠番号を取得
            const noLabel = scheduleRow.querySelector('.no-label');
            const formworkNo = noLabel ? noLabel.textContent.trim() : '';
            
            // プロジェクト名を取得
            const projectNameElement = projectSection.querySelector('.project-name');
            const projectName = projectNameElement ? projectNameElement.textContent.trim() : '';
            
            // 製品番号を取得
            const productId = product.id || '';
            
            // ライン名を取得
            const lineNameElement = scheduleRow.querySelector('.line-name');
            const lineName = lineNameElement ? lineNameElement.textContent.trim() : '';
            
            // 工場を特定
            let factory = null;
            if (lineName.startsWith('栃木_')) {
                factory = 'tochigi-factory';
            } else if (lineName.startsWith('茨城_')) {
                factory = 'ibaraki-factory';
            }
            
            // 茨城_B1ラインと茨城_B2ラインの場合は、茨城_Aラインのデータを参照
            let targetLineName = lineName;
            if (lineName === '茨城_B1ライン' || lineName === '茨城_B2ライン') {
                targetLineName = '茨城_Aライン';
            }
            
            if (!factory || !sharedScheduleData[factory] || !sharedScheduleData[factory][targetLineName]) {
                return;
            }
            
            const projects = sharedScheduleData[factory][targetLineName];
            if (!projects[projectName]) {
                return;
            }
            
            // 該当するデータを検索して更新
            const projectDataArray = projects[projectName];
            let found = false;
            projectDataArray.forEach((data, index) => {
                // 型枠番号と製品番号で一致するデータを探す
                const dataFormworkNo = data.formworkNo || `No.${index + 1}`;
                if (dataFormworkNo === formworkNo && data.id === productId) {
                    // 打設完了ステータスを更新
                    data.status = '打設完了';
                    data.pouringStatus = 'completed';
                    data.color = 'pink';
                    found = true;
                    console.log('打設完了ステータスを更新しました:', {
                        factory,
                        targetLineName,
                        projectName,
                        formworkNo,
                        productId,
                        status: data.status,
                        pouringStatus: data.pouringStatus,
                        color: data.color
                    });
                }
            });
            if (!found) {
                console.warn('打設完了ステータスを更新するデータが見つかりませんでした:', {
                    factory,
                    targetLineName,
                    projectName,
                    formworkNo,
                    productId
                });
            }
        }
    });
    
    // 画面表示を更新
    // 注文画面の更新
    if (typeof updateOrderItems === 'function') {
        updateOrderItems();
    }
    
    // 生産指示画面の更新
    if (typeof updateLineProductionDisplay === 'function' && typeof window.selectedLineName !== 'undefined') {
        updateLineProductionDisplay(window.selectedLineName);
        
        // 画面更新後にdate-cellのstatusを更新
        // updateLineProductionDisplayがdate-cellを再生成するため、その後に更新する必要がある
        // setupProductionDateCellClickHandlersが100ms後に実行されるので、それより後に実行
        setTimeout(() => {
            selectedProducts.forEach(product => {
                if (product.id) {
                    // 再生成されたdate-cellを検索
                    const dateCells = document.querySelectorAll('#line-project-sections-container .date-cell:not(.empty)');
                    let found = false;
                    dateCells.forEach(cell => {
                        const cellProductId = cell.getAttribute('data-product-id');
                        if (cellProductId === product.id) {
                            // date-cellのdata-status属性を更新
                            cell.setAttribute('data-status', '打設完了');
                            
                            // date-cell内のstatus表示を更新
                            const statusElement = cell.querySelector('.status');
                            if (statusElement) {
                                statusElement.textContent = '打設完了';
                            }
                            
                            // 既存のcolorクラスを削除（orange, yellow, light-yellowなど）
                            cell.classList.remove('orange', 'yellow', 'light-yellow', 'pink');
                            
                            // pinkクラスを追加
                            cell.classList.add('pink');
                            
                            // completedクラスを追加
                            cell.classList.add('completed');
                            found = true;
                            console.log('date-cellを更新しました:', {
                                productId: product.id,
                                cellProductId,
                                status: cell.getAttribute('data-status'),
                                className: cell.className
                            });
                        }
                    });
                    if (!found) {
                        console.warn('date-cellが見つかりませんでした:', {
                            productId: product.id,
                            totalCells: dateCells.length
                        });
                    }
                }
            });
        }, 200);
    }
    
    // 選択をクリア
    if (typeof clearAllProductionSelections === 'function') {
        clearAllProductionSelections();
    }
}

// ========================================
// 数量変更依頼モーダルの確定処理
// ========================================

// 数量変更依頼モーダルの確定時の処理
function handleChangeRequestConfirm() {
    // 注文済みデータからの変更依頼の場合
    if (currentOrderedDataChangeRequest) {
        handleOrderedDataChangeRequestConfirm();
        return;
    }
    
    // 変更前の量を取得（spanから）
    const beforeQuantitySpan = document.querySelector('#change-request-modal .quantity-change:first-child span');
    if (!beforeQuantitySpan) {
        console.error('変更前の量が見つかりません');
        return;
    }
    const beforeQuantityText = beforeQuantitySpan.textContent.trim();
    const beforeQuantity = parseFloat(beforeQuantityText.replace(/[m³㎥]/g, '')) || 0;
    
    // 変更後の量を取得（inputから）
    const afterQuantityInput = document.querySelector('#change-request-modal .quantity-change:last-child input');
    if (!afterQuantityInput) {
        console.error('変更後の量のinputが見つかりません');
        return;
    }
    const afterQuantityText = afterQuantityInput.value.trim();
    const afterQuantity = parseFloat(afterQuantityText) || 0;
    
    // 選択行のm3数を変更後の量に更新
    const selectedRow = document.querySelector('#production-instruction-screen .batch-info-table tbody tr.selected-requested');
    if (selectedRow) {
        const m3Cell = selectedRow.querySelector('td:nth-child(2)');
        if (m3Cell) {
            m3Cell.textContent = afterQuantity.toFixed(2);
        }
    }
    
    // 注文数量の値を取得
    const orderQuantitySpan = document.querySelector('#production-instruction-screen .order-info-section .change-field:first-child span');
    if (!orderQuantitySpan) {
        console.error('注文数量のspanが見つかりません');
        return;
    }
    const orderQuantityText = orderQuantitySpan.textContent.trim();
    const orderQuantity = parseFloat(orderQuantityText) || 0;
    
    // 変更差分を計算（変更前の量 - 変更後の量）
    const changeDiff = beforeQuantity - afterQuantity;
    
    // 変更1から変更5までのspanを取得
    const change1Span = document.querySelector('#production-instruction-screen .order-info-section .change-field:nth-child(2) span');
    const change2Span = document.querySelector('#production-instruction-screen .order-info-section .change-field:nth-child(3) span');
    const change3Span = document.querySelector('#production-instruction-screen .order-info-section .change-field:nth-child(4) span');
    const change4Span = document.querySelector('#production-instruction-screen .order-info-section .change-field:nth-child(5) span');
    const change5Span = document.querySelector('#production-instruction-screen .order-info-section .change-field:nth-child(6) span');
    
    // 変更1から変更5までの値を取得（空の場合は0として扱う）
    const getChangeValue = (span) => {
        if (!span) return null;
        const value = span.textContent.trim();
        return value === '' ? null : parseFloat(value);
    };
    
    const change1Value = getChangeValue(change1Span);
    const change2Value = getChangeValue(change2Span);
    const change3Value = getChangeValue(change3Span);
    const change4Value = getChangeValue(change4Span);
    const change5Value = getChangeValue(change5Span);
    
    // 連続変更依頼のロジックに従って値を設定
    if (change1Value === null) {
        // 変更1に値が無ければ：注文数量 - (変更前の量 - 変更後の量)を変更1に入れる
        if (change1Span) {
            const newValue = orderQuantity - changeDiff;
            change1Span.textContent = newValue.toFixed(2);
        }
    } else if (change2Value === null) {
        // 変更1に値があって変更2に値が無ければ：変更1 - (変更前の量 - 変更後の量)を変更2に入れる
        if (change2Span) {
            const newValue = change1Value - changeDiff;
            change2Span.textContent = newValue.toFixed(2);
        }
    } else if (change3Value === null) {
        // 変更2に値があって変更3に値が無ければ：変更2 - (変更前の量 - 変更後の量)を変更3に入れる
        if (change3Span) {
            const newValue = change2Value - changeDiff;
            change3Span.textContent = newValue.toFixed(2);
        }
    } else if (change4Value === null) {
        // 変更3に値があって変更4に値が無ければ：変更3 - (変更前の量 - 変更後の量)を変更4に入れる
        if (change4Span) {
            const newValue = change3Value - changeDiff;
            change4Span.textContent = newValue.toFixed(2);
        }
    } else if (change5Value === null) {
        // 変更4に値があって変更5に値が無ければ：変更4 - (変更前の量 - 変更後の量)を変更5に入れる
        if (change5Span) {
            const newValue = change4Value - changeDiff;
            change5Span.textContent = newValue.toFixed(2);
        }
    }
    
    // 変更5に値があるかチェックして、change-order-quantity-btnの状態を更新
    if (typeof updateActionButtonsState === 'function') {
        updateActionButtonsState();
    }
}

// 注文済みデータの数量変更依頼モーダルの確定時の処理
function handleOrderedDataChangeRequestConfirm() {
    if (!currentOrderedDataChangeRequest) {
        console.error('注文済みデータの変更依頼情報が見つかりません');
        return;
    }
    
    // 変更後の量を取得（inputから）
    const afterQuantityInput = document.querySelector('#change-request-modal .quantity-change:last-child input');
    if (!afterQuantityInput) {
        console.error('変更後の量のinputが見つかりません');
        return;
    }
    const afterQuantityText = afterQuantityInput.value.trim();
    const changeRequestVolume = parseFloat(afterQuantityText) || 0;
    
    // バッチデータを取得または作成
    const batchDataKey = currentOrderedDataChangeRequest.batchDataKey;
    const existingBatchData = batchData[batchDataKey];
    
    // 注文データを取得
    const order = orderData[currentOrderedDataChangeRequest.factory][currentOrderedDataChangeRequest.line][currentOrderedDataChangeRequest.orderIndex];
    if (!order) {
        console.error('注文データが見つかりません');
        return;
    }
    
    // バッチデータを更新または作成
    const batchDataEntry = {
        ids: [order.id], // 複数のidがある場合は配列に追加
        batchVolume: parseFloat(currentOrderedDataChangeRequest.batchVolume),
        changeRequestVolume: changeRequestVolume,
        orderDataKey: currentOrderedDataChangeRequest.orderDataKey,
        status: 'ordered' // 初期値は全て'ordered'
    };
    
    // batch-data.jsに保存
    batchData[batchDataKey] = batchDataEntry;
    
    // 画面を更新
    if (typeof updateOrderItems === 'function') {
        updateOrderItems();
    }
    
    // 現在の変更依頼情報をクリア
    currentOrderedDataChangeRequest = null;
}
