// ========================================
// ラインエリア - 注文管理
// ========================================

// 打設順変更モードの状態管理
let isSortOrderMode = false;
let draggedElement = null;
let draggedOverElement = null;
let autoScrollInterval = null;

// 注文管理関連の初期化
function initializeLineAreaOrderManagement() {
    // 注文アイテムを動的に生成（generateOrderItems内でイベントも設定される）
    generateOrderItems();
    
    // filter-selectorのイベント設定
    setupFilterSelectorEvents();
    
    // 注文ボタンの状態を更新（初期状態ではチェックがないため無効化される）
    if (typeof updateOrderButtonEnabledState === 'function') {
        updateOrderButtonEnabledState();
    }
}

// 注文画面の打設完了ボタンのイベント設定（イベント委譲）
function setupOrderStatusButtonEvents() {
    const orderGrid = document.getElementById('order-grid');
    if (!orderGrid) return;
    
    // 既存のイベントリスナーを削除（重複防止のため、一度だけ設定）
    // 既に設定済みの場合は、古いイベントリスナーを削除してから再設定
    const existingHandler = orderGrid.getAttribute('data-status-handler');
    if (existingHandler === 'true') {
        // 既存のイベントリスナーを削除するために、新しい要素に置き換える
        const newOrderGrid = orderGrid.cloneNode(true);
        orderGrid.parentNode.replaceChild(newOrderGrid, orderGrid);
        // 新しい要素に対してイベントを設定
        setupOrderStatusButtonEventsOnElement(newOrderGrid);
        return;
    }
    
    // 初回設定
    setupOrderStatusButtonEventsOnElement(orderGrid);
    orderGrid.setAttribute('data-status-handler', 'true');
}

// 指定された要素にイベントリスナーを設定
function setupOrderStatusButtonEventsOnElement(orderGrid) {
    // イベント委譲で打設完了ボタンのクリックイベントを設定
    orderGrid.addEventListener('click', function(event) {
        const target = event.target;
        if (target.classList.contains('status-btn') && target.classList.contains('status-incomplete')) {
            const orderItem = target.closest('.order-item');
            if (orderItem) {
                // handleOrderItemCompletion関数が存在する場合は呼び出す
                if (typeof handleOrderItemCompletion === 'function') {
                    handleOrderItemCompletion(target, orderItem);
                }
            }
        }
    });
}

// concrete-optionチェックボックスのイベント設定
function setupConcreteOptionCheckboxEvents() {
    const orderGrid = document.getElementById('order-grid');
    if (!orderGrid) return;
    
    // 既存のイベントリスナーを削除（重複防止のため）
    const existingHandler = orderGrid.getAttribute('data-checkbox-handler');
    if (existingHandler === 'true') {
        // 既存のイベントリスナーを削除するために、新しい要素で置き換え
        const newOrderGrid = orderGrid.cloneNode(true);
        // 属性を保持
        const statusHandler = orderGrid.getAttribute('data-status-handler');
        if (statusHandler) {
            newOrderGrid.setAttribute('data-status-handler', statusHandler);
        }
        orderGrid.parentNode.replaceChild(newOrderGrid, orderGrid);
        setupConcreteOptionCheckboxEventsOnElement(newOrderGrid);
        newOrderGrid.setAttribute('data-checkbox-handler', 'true');
        return;
    }
    
    // 初回設定
    setupConcreteOptionCheckboxEventsOnElement(orderGrid);
    orderGrid.setAttribute('data-checkbox-handler', 'true');
}

// 指定された要素にcheckboxイベントリスナーを設定
function setupConcreteOptionCheckboxEventsOnElement(orderGrid) {
    // イベント委譲でcheckboxのchangeイベントを設定
    orderGrid.addEventListener('change', function(event) {
        const target = event.target;
        if (target && target.type === 'checkbox' && target.closest('.concrete-option')) {
            handleConcreteOptionCheckboxChange(target);
        }
    });
}

// 注文アイテムを生成する関数
function generateOrderItems() {
    const orderGrid = document.getElementById('order-grid');
    if (!orderGrid) return;
    
    // 既存のアイテムを完全にクリア（data-status-handler属性は保持）
    const statusHandler = orderGrid.getAttribute('data-status-handler');
    const checkboxHandler = orderGrid.getAttribute('data-checkbox-handler');
    const changeRequestHandler = orderGrid.getAttribute('data-change-request-handler');
    
    // 子要素をすべて削除（innerHTMLよりも確実）
    while (orderGrid.firstChild) {
        orderGrid.removeChild(orderGrid.firstChild);
    }
    
    // innerHTMLも空にする（念のため）
    orderGrid.innerHTML = '';
    
    if (statusHandler) {
        orderGrid.setAttribute('data-status-handler', statusHandler);
    }
    // checkbox-handlerとchange-request-handler属性は削除（再設定時に正しく動作させるため）
    orderGrid.removeAttribute('data-checkbox-handler');
    orderGrid.removeAttribute('data-change-request-handler');
    
    // ユーザーIDに応じて表示するfactoryを決定
    const userId = localStorage.getItem('userId');
    let targetFactories = Object.keys(sharedScheduleData);
    
    if (userId === '000') {
        // 栃木ログイン時：tochigi-factoryのみ表示
        targetFactories = ['tochigi-factory'];
    } else if (userId === '111') {
        // 茨城ログイン時：ibaraki-factoryのみ表示
        targetFactories = ['ibaraki-factory'];
    }
    
    // 選択されたラインを取得
    const lineSelector = document.querySelector('.line-selector');
    let selectedLineName = null;
    if (lineSelector) {
        const selectedOption = lineSelector.options[lineSelector.selectedIndex];
        if (selectedOption) {
            selectedLineName = selectedOption.text.trim();
        }
    }
    // localStorageからも取得を試みる
    if (!selectedLineName) {
        selectedLineName = localStorage.getItem('selectedLineName');
    }
    
    // すべての工場とラインからデータを取得
    const allOrderItems = [];
    
    targetFactories.forEach(factory => {
        // 対象外のfactoryはスキップ
        if (!sharedScheduleData[factory]) return;
        Object.keys(sharedScheduleData[factory]).forEach(line => {
            // 選択されたラインに基づいてフィルタリング
            // 選択されたラインがない場合は全て表示
            if (selectedLineName) {
                // 茨城_B1ラインと茨城_B2ラインの場合は、茨城_Aラインのデータも含める
                if (selectedLineName === '茨城_B1ライン' || selectedLineName === '茨城_B2ライン') {
                    if (line !== selectedLineName && line !== '茨城_Aライン') {
                        return;
                    }
                } else {
                    // それ以外の場合は、選択されたラインと完全一致するもののみ
                    if (line !== selectedLineName) {
                        return;
                    }
                }
            }
            
            const projects = sharedScheduleData[factory][line];
            Object.keys(projects).forEach(projectName => {
                const projectDataArray = projects[projectName];
                projectDataArray.forEach((data, index) => {
                    // 空のデータはスキップ
                    if (!data.id || data.id === '') return;
                    
                    // 今日または明日のデータのみ表示
                    if (data.date !== 'today' && data.date !== 'tomorrow') return;
                    
                    // コンクリート種類と数量を抽出
                    const concreteTypes = [];
                    if (Array.isArray(data.value) && Array.isArray(data.unit)) {
                        for (let i = 0; i < data.value.length; i++) {
                            if (data.value[i] !== null && data.value[i] !== undefined && data.value[i] !== '' &&
                                data.unit[i] && data.unit[i].trim() !== '') {
                                concreteTypes.push({
                                    unit: data.unit[i],
                                    value: data.value[i]
                                });
                            }
                        }
                    }
                    
                    // コンクリート種類がない場合はスキップ
                    if (concreteTypes.length === 0) return;
                    
                    allOrderItems.push({
                        projectName: projectName,
                        floor: data.floor || '',
                        id: data.id,
                        concreteTypes: concreteTypes,
                        formworkNo: data.formworkNo || `No.${index + 1}`,
                        pouringStatus: data.pouringStatus || 'incomplete',
                        factory: factory,
                        line: line,
                        dataIndex: index
                    });
                });
            });
        });
    });
    
    // プロジェクト名、階数、型枠番号、ラインでグループ化（lineを含めることで異なるlineのデータを分離）
    const groupedItems = {};
    allOrderItems.forEach(item => {
        const key = `${item.projectName}_${item.floor}_${item.formworkNo}_${item.line}`;
        if (!groupedItems[key]) {
            groupedItems[key] = {
                projectName: item.projectName,
                floor: item.floor,
                id: item.id, // 最初のアイテムのid（製品番号）を保存
                formworkNo: item.formworkNo,
                pouringStatus: item.pouringStatus,
                factory: item.factory, // 最初のアイテムのfactoryを保存
                line: item.line, // 最初のアイテムのlineを保存
                concreteTypes: [],
                items: []
            };
        }
        // コンクリート種類をマージ（重複を避ける）
        item.concreteTypes.forEach(ct => {
            const existing = groupedItems[key].concreteTypes.find(c => c.unit === ct.unit);
            if (existing) {
                // 丸め誤差を防ぐため、加算後に小数点以下1桁に丸める
                const sum = parseFloat(existing.value) + parseFloat(ct.value);
                existing.value = Math.round(sum * 10) / 10;
            } else {
                groupedItems[key].concreteTypes.push({...ct});
            }
        });
        groupedItems[key].items.push(item);
    });
    
    // グループ化されたアイテムからorder-itemを生成
    Object.values(groupedItems).forEach(group => {
        // order-data.jsにidが存在するかチェック
        const orderDataEntry = findOrderDataById(group.id, group.factory, group.line);
        
        if (orderDataEntry) {
            // 注文済みデータとして表示
            const orderItem = createOrderedDataItemElementFromGroup(group, orderDataEntry);
            orderGrid.appendChild(orderItem);
        } else {
            // 通常の表示
            const orderItem = createOrderItemElement(group);
            orderGrid.appendChild(orderItem);
        }
    });
    
    // 打設完了ボタンのイベントを設定（動的に生成されたボタン用）
    setupOrderStatusButtonEvents();
    
    // concrete-optionチェックボックスのイベントを設定
    setupConcreteOptionCheckboxEvents();
    
    // 変更依頼ボタンのイベントを設定
    setupChangeRequestButtonEvents();
    
    // 打設順変更モードが有効な場合は、ドラッグ&ドロップ機能を有効化
    if (isSortOrderMode) {
        enableDragAndDrop();
    }
    
    // 現在選択されているfilter-selectorの値に基づいてフィルタリングを適用
    // ただし、チェックボックスが選択されている場合は、そのフィルタリングを優先
    const checkedCheckboxes = document.querySelectorAll('#order-grid .concrete-option input[type="checkbox"]:checked');
    if (checkedCheckboxes.length > 0) {
        // チェックボックスが選択されている場合、その条件でフィルタリング
        const firstChecked = checkedCheckboxes[0];
        const firstOrderItem = firstChecked.closest('.order-item');
        if (firstOrderItem) {
            const firstProjectName = firstOrderItem.getAttribute('data-project-name');
            const firstUnit = firstChecked.getAttribute('data-unit');
            filterOrderItemsByConcreteOption(firstProjectName, firstUnit);
        }
    } else {
        // チェックボックスが選択されていない場合、filter-selectorのフィルタリングを適用
        const filterSelector = document.querySelector('.filter-selector');
        if (filterSelector) {
            const filterType = filterSelector.value;
            filterOrderItems(filterType);
        }
    }
    
    // 注文ボタンの状態を更新
    if (typeof updateOrderButtonEnabledState === 'function') {
        updateOrderButtonEnabledState();
    }
}

// 時刻情報のHTMLを生成する関数（打設済み用）
function generateTimeInfoHtml(value, orderTimeParam) {
    // valueを数値に変換し、丸め誤差を防ぐため小数点以下1桁に丸める
    const totalValue = Math.round((parseFloat(value) || 0) * 10) / 10;
    
    // 注文時刻を決定（パラメータがあればそれを使用、なければデフォルト値）
    let orderTime = orderTimeParam;
    let orderHour = 14;
    let orderMinute = 1;
    
    if (orderTime) {
        // orderTimeが"HH:MM"形式の場合、時刻をパース
        const timeMatch = orderTime.match(/(\d{2}):(\d{2})/);
        if (timeMatch) {
            orderHour = parseInt(timeMatch[1], 10);
            orderMinute = parseInt(timeMatch[2], 10);
        }
    } else {
        // デフォルト時刻を使用
        orderTime = `${String(orderHour).padStart(2, '0')}:${String(orderMinute).padStart(2, '0')}`;
    }
    
    // 1.3㎥ずつに分割
    const batchSize = 1.3;
    const batches = [];
    let remaining = totalValue;
    
    while (remaining > 0.01) { // 0.01未満の微小な値は無視（丸め誤差対策）
        if (remaining >= batchSize) {
            batches.push(batchSize);
            remaining = Math.round((remaining - batchSize) * 10) / 10; // 丸め誤差を防ぐ
        } else {
            // 残りを小数点以下1桁に丸める
            const finalBatch = Math.round(remaining * 10) / 10;
            batches.push(finalBatch);
            remaining = 0;
        }
    }
    
    // 練り上がり時刻を生成（注文時刻から順次時間を追加）
    let currentMinute = orderMinute;
    let currentHour = orderHour;
    const mixingTimes = [];
    
    batches.forEach((batch, index) => {
        // 各バッチごとに時間を追加（最初は16分後、以降は3分、7分、12分など適切な間隔）
        if (index === 0) {
            currentMinute += 16;
        } else if (index === 1) {
            currentMinute += 3;
        } else if (index === 2) {
            currentMinute += 3;
        } else if (index === 3) {
            currentMinute += 7;
        } else {
            currentMinute += 12;
        }
        
        // 60分を超えた場合は時間を繰り上げ
        while (currentMinute >= 60) {
            currentMinute -= 60;
            currentHour += 1;
        }
        
        const mixingTime = `${String(currentHour).padStart(2, '0')}:${String(currentMinute).padStart(2, '0')}`;
        mixingTimes.push({
            volume: batch.toFixed(2),
            time: mixingTime
        });
    });
    
    // HTMLを生成
    let html = `<div class="order-info">`;
    html += `<div class="order-time">注文時刻:${orderTime}</div>`;
    html += `<div class="mixing-info-container">`;
    
    mixingTimes.forEach((mixing, index) => {
        // 実際の量を表示
        html += `<div class="mixing-info">${mixing.volume}㎥ 練り上がり時刻:${mixing.time}</div>`;
    });
    
    html += `</div></div>`;
    
    return html;
}

// order-item要素を作成する関数
function createOrderItemElement(group) {
    const orderItem = document.createElement('div');
    orderItem.className = 'order-item';
    
    // 打設完了ステータスに応じた表示を決定
    let statusHtml = '';
    if (group.pouringStatus === 'completed') {
        // 打設完了：テキストで「打設済み」と表示
        statusHtml = '<span class="status-text status-completed">打設済み</span>';
    } else {
        // 打設未完了：ボタンで「打設完了」と表示
        statusHtml = '<button class="status-btn status-incomplete">打設完了</button>';
    }
    
    // 注文時刻が設定されているかどうかを確認（少なくとも1つのconcreteTypeに注文時刻があるか）
    let hasOrderTime = false;
    
    // コンクリート種類のHTMLを生成
    const concreteTypesHtml = group.concreteTypes.map(ct => {
        // 表示用に値を小数点以下1桁に丸める（丸め誤差対策、表示時は小数点第2位まで表示）
        const displayValue = Math.round(parseFloat(ct.value) * 10) / 10;
        
        // 注文時刻を取得（sharedScheduleDataから、order-data.jsも確認）
        // orderTimesは配列で複数の注文時刻を保持できる
        let orderTimes = [];
        if (group.factory && group.line) {
            const projects = sharedScheduleData[group.factory] && sharedScheduleData[group.factory][group.line];
            if (projects && projects[group.projectName]) {
                const projectDataArray = projects[group.projectName];
                projectDataArray.forEach((data, index) => {
                    const dataFormworkNo = data.formworkNo || `No.${index + 1}`;
                    if (dataFormworkNo === group.formworkNo && data.floor === group.floor) {
                        if (data.orderTimes && data.orderTimes[ct.unit]) {
                            // orderTimesが配列の場合はそのまま使用、文字列の場合は配列に変換
                            const times = data.orderTimes[ct.unit];
                            if (Array.isArray(times)) {
                                orderTimes = [...times];
                            } else {
                                orderTimes = [times];
                            }
                            hasOrderTime = true; // 注文時刻が設定されている
                        }
                        
                        // order-data.jsに既存の注文データがある場合、その注文時刻も追加
                        // ただし、既に配列に含まれていない場合のみ
                        if (data.id && typeof findOrderDataById === 'function') {
                            const orderDataEntry = findOrderDataById(data.id, group.factory, group.line);
                            if (orderDataEntry && orderDataEntry.order) {
                                const order = orderDataEntry.order;
                                // order-data.jsのstrengthとunitが一致する場合
                                if (order.strength === ct.unit && order.time) {
                                    // 既に配列に含まれていない場合のみ追加
                                    if (!orderTimes.includes(order.time)) {
                                        orderTimes.push(order.time);
                                        hasOrderTime = true;
                                    }
                                }
                            }
                        }
                    }
                });
            }
        }
        
        let optionHtml = `
            <div class="concrete-option-wrapper">
                <label class="concrete-option">
                    <input type="checkbox" data-unit="${ct.unit}" data-value="${displayValue}">
                    <span><span class="concrete-unit">${ct.unit}</span><span class="concrete-volume">${displayValue.toFixed(2)}㎥</span></span>
                </label>
        `;
        
        // 注文時刻がある場合の処理
        if (orderTimes.length > 0) {
            if (group.pouringStatus === 'completed') {
                // 打設済みの場合：複数の注文時刻に対してorder-infoを生成
                // 最初の注文時刻で全体の量を表示し、追加注文時刻はその下に表示
                const firstOrderTime = orderTimes[0];
                optionHtml += generateTimeInfoHtml(displayValue, firstOrderTime);
                
                // 追加注文時刻がある場合、その下に注文時刻のみを表示
                if (orderTimes.length > 1) {
                    for (let i = 1; i < orderTimes.length; i++) {
                        optionHtml += `<div class="order-time">注文時刻:${orderTimes[i]}</div>`;
                    }
                }
            } else {
                // 打設未完了の場合：全ての注文時刻を表示
                orderTimes.forEach(orderTime => {
                    optionHtml += `<div class="order-time">注文時刻:${orderTime}</div>`;
                });
            }
        }
        
        optionHtml += `</div>`;
        
        return optionHtml;
    }).join('');
    
    orderItem.innerHTML = `
        <div class="order-header">
            <h3>${group.projectName}</h3>
            ${statusHtml}
        </div>
        <div class="order-details">
            <div class="floor-info">${group.id}</div>
            <div class="concrete-types">
                ${concreteTypesHtml}
            </div>
            <div class="formwork-info">型枠${group.formworkNo}</div>
            <textarea class="memo" placeholder="メモ"></textarea>
        </div>
    `;
    
    // データ属性を設定（打設完了機能で使用）
    orderItem.setAttribute('data-project-name', group.projectName);
    orderItem.setAttribute('data-floor', group.floor);
    orderItem.setAttribute('data-formwork-no', group.formworkNo);
    orderItem.setAttribute('data-pouring-status', group.pouringStatus);
    if (group.factory) {
        orderItem.setAttribute('data-factory', group.factory);
    }
    if (group.line) {
        orderItem.setAttribute('data-line', group.line);
    }
    
    // 注文時刻が設定されている場合、orderedクラスを追加して枠を緑にする
    if (hasOrderTime) {
        orderItem.classList.add('ordered');
    }
    
    return orderItem;
}

// 注文アイテムを更新する関数（打設完了ステータス変更時など）
function updateOrderItems() {
    generateOrderItems();
    // generateOrderItems内でイベントも設定される
}

// 注文アイテムの状態を更新する関数
function updateOrderItemStatus(itemId, status) {
    const orderItem = document.querySelector(`[data-item-id="${itemId}"]`);
    if (orderItem) {
        // ステータスに応じてクラスを更新
        orderItem.classList.remove('pending', 'in-progress', 'completed');
        orderItem.classList.add(status);
        
        // ステータス表示を更新
        const statusElement = orderItem.querySelector('.order-status');
        if (statusElement) {
            statusElement.textContent = getStatusText(status);
        }
    }
}

// ステータステキストを取得する関数
function getStatusText(status) {
    const statusTexts = {
        'pending': '待機中',
        'in-progress': '進行中',
        'completed': '完了'
    };
    return statusTexts[status] || status;
}

// 注文アイテムの詳細情報を更新する関数
function updateOrderItemDetails(itemId, details) {
    const orderItem = document.querySelector(`[data-item-id="${itemId}"]`);
    if (orderItem) {
        // 詳細情報を更新
        Object.keys(details).forEach(key => {
            const element = orderItem.querySelector(`[data-field="${key}"]`);
            if (element) {
                element.textContent = details[key];
            }
        });
    }
}

// filter-selectorのイベント設定
function setupFilterSelectorEvents() {
    const filterSelector = document.querySelector('.filter-selector');
    if (!filterSelector) return;
    
    // 既存のイベントリスナーを削除するために、新しい要素で置き換え
    const newFilterSelector = filterSelector.cloneNode(true);
    filterSelector.parentNode.replaceChild(newFilterSelector, filterSelector);
    
    // イベントリスナーを追加
    newFilterSelector.addEventListener('change', function() {
        const filterType = this.value;
        // チェックボックスのフィルタリングが有効な場合は、それも考慮してフィルタリング
        const checkedCheckboxes = document.querySelectorAll('#order-grid .concrete-option input[type="checkbox"]:checked');
        if (checkedCheckboxes.length > 0) {
            // チェックボックスが選択されている場合、その条件も考慮してフィルタリング
            const firstChecked = checkedCheckboxes[0];
            const firstOrderItem = firstChecked.closest('.order-item');
            if (firstOrderItem) {
                const firstProjectName = firstOrderItem.getAttribute('data-project-name');
                const firstUnit = firstChecked.getAttribute('data-unit');
                filterOrderItemsByConcreteOption(firstProjectName, firstUnit);
            }
        } else {
            // チェックボックスが選択されていない場合、通常のフィルタリング
            filterOrderItems(filterType);
        }
    });
}

// 注文アイテムをフィルタリングする関数
function filterOrderItems(filterType) {
    const orderItems = document.querySelectorAll('.order-item');
    
    orderItems.forEach(item => {
        // data-pouring-status属性から打設完了ステータスを取得
        const pouringStatus = item.getAttribute('data-pouring-status') || 'incomplete';
        
        if (filterType === 'all') {
            // 全ての製品を表示
            item.style.display = 'block';
        } else if (filterType === 'incomplete') {
            // 打設未完了製品のみ表示
            if (pouringStatus !== 'completed') {
                item.style.display = 'block';
            } else {
                item.style.display = 'none';
            }
        } else if (filterType === 'completed') {
            // 打設完了済製品のみ表示
            if (pouringStatus === 'completed') {
                item.style.display = 'block';
            } else {
                item.style.display = 'none';
            }
        } else {
            // デフォルトは全て表示
            item.style.display = 'block';
        }
    });
}

// 注文アイテムをソートする関数
function sortOrderItems(sortBy) {
    const orderContainer = document.querySelector('.order-items-container');
    if (!orderContainer) return;
    
    const orderItems = Array.from(orderContainer.querySelectorAll('.order-item'));
    
    orderItems.sort((a, b) => {
        switch (sortBy) {
            case 'time':
                const timeA = a.querySelector('[data-field="time"]')?.textContent || '';
                const timeB = b.querySelector('[data-field="time"]')?.textContent || '';
                return timeA.localeCompare(timeB);
            case 'status':
                const statusA = a.classList.contains('pending') ? 0 : 
                               a.classList.contains('in-progress') ? 1 : 2;
                const statusB = b.classList.contains('pending') ? 0 : 
                               b.classList.contains('in-progress') ? 1 : 2;
                return statusA - statusB;
            default:
                return 0;
        }
    });
    
    // ソートされた順序でDOMに再配置
    orderItems.forEach(item => orderContainer.appendChild(item));
}

// concrete-optionチェックボックスの変更を処理する関数
function handleConcreteOptionCheckboxChange(checkbox) {
    const orderItem = checkbox.closest('.order-item');
    if (!orderItem) return;
    
    const projectName = orderItem.getAttribute('data-project-name');
    const unit = checkbox.getAttribute('data-unit');
    const isChecked = checkbox.checked;
    
    if (isChecked) {
        // チェックがついた場合：フィルタリングとunit制限を適用
        filterOrderItemsByConcreteOption(projectName, unit);
        disableIncompatibleUnits(unit);
    } else {
        // チェックが外れた場合：全てのチェックボックスの状態を確認
        const checkedCheckboxes = document.querySelectorAll('#order-grid .concrete-option input[type="checkbox"]:checked');
        
        if (checkedCheckboxes.length === 0) {
            // チェックが一つもない場合：全て表示し、全てのcheckboxを有効化
            showAllOrderItems();
            enableAllCheckboxes();
        } else {
            // 他のチェックが残っている場合：最初のチェックされたcheckboxの条件でフィルタリング
            const firstChecked = checkedCheckboxes[0];
            const firstOrderItem = firstChecked.closest('.order-item');
            if (firstOrderItem) {
                const firstProjectName = firstOrderItem.getAttribute('data-project-name');
                const firstUnit = firstChecked.getAttribute('data-unit');
                filterOrderItemsByConcreteOption(firstProjectName, firstUnit);
                disableIncompatibleUnits(firstUnit);
            }
        }
    }
    
    // 注文ボタンの状態を更新
    if (typeof updateOrderButtonEnabledState === 'function') {
        updateOrderButtonEnabledState();
    }
}

// projectNameとunitで注文アイテムをフィルタリングする関数
function filterOrderItemsByConcreteOption(projectName, unit) {
    const orderItems = document.querySelectorAll('#order-grid .order-item');
    
    orderItems.forEach(item => {
        const itemProjectName = item.getAttribute('data-project-name');
        const concreteOptions = item.querySelectorAll('.concrete-option input[type="checkbox"]');
        
        // 同じprojectNameで、かつ同じunitを持つcheckboxがあるかチェック
        let hasMatchingUnit = false;
        if (itemProjectName === projectName) {
            concreteOptions.forEach(checkbox => {
                const checkboxUnit = checkbox.getAttribute('data-unit');
                if (checkboxUnit === unit) {
                    hasMatchingUnit = true;
                }
            });
        }
        
        // projectNameとunitの両方に一致するアイテムのみ表示
        // ただし、filter-selectorのフィルタリングも考慮する
        const pouringStatus = item.getAttribute('data-pouring-status') || 'incomplete';
        const filterSelector = document.querySelector('.filter-selector');
        const filterType = filterSelector ? filterSelector.value : 'all';
        
        let shouldShowByFilter = true;
        if (filterType === 'incomplete') {
            shouldShowByFilter = (pouringStatus !== 'completed');
        } else if (filterType === 'completed') {
            shouldShowByFilter = (pouringStatus === 'completed');
        }
        
        // projectNameとunitの両方に一致し、かつfilter-selectorの条件も満たす場合のみ表示
        if (itemProjectName === projectName && hasMatchingUnit && shouldShowByFilter) {
            item.style.display = 'block';
        } else {
            item.style.display = 'none';
        }
    });
}

// 異なるunitのcheckboxを無効化する関数
function disableIncompatibleUnits(selectedUnit) {
    const allCheckboxes = document.querySelectorAll('#order-grid .concrete-option input[type="checkbox"]');
    
    allCheckboxes.forEach(checkbox => {
        const checkboxUnit = checkbox.getAttribute('data-unit');
        if (checkboxUnit !== selectedUnit) {
            checkbox.disabled = true;
        } else {
            checkbox.disabled = false;
        }
    });
}

// 全ての注文アイテムを表示する関数
function showAllOrderItems() {
    // filter-selectorのフィルタリングも考慮する
    const filterSelector = document.querySelector('.filter-selector');
    const filterType = filterSelector ? filterSelector.value : 'all';
    
    const orderItems = document.querySelectorAll('#order-grid .order-item');
    orderItems.forEach(item => {
        const pouringStatus = item.getAttribute('data-pouring-status') || 'incomplete';
        
        let shouldShow = true;
        if (filterType === 'incomplete') {
            shouldShow = (pouringStatus !== 'completed');
        } else if (filterType === 'completed') {
            shouldShow = (pouringStatus === 'completed');
        }
        
        if (shouldShow) {
            item.style.display = 'block';
        } else {
            item.style.display = 'none';
        }
    });
}

// 全てのcheckboxを有効化する関数
function enableAllCheckboxes() {
    const allCheckboxes = document.querySelectorAll('#order-grid .concrete-option input[type="checkbox"]');
    allCheckboxes.forEach(checkbox => {
        checkbox.disabled = false;
    });
}

// ========================================
// 打設順変更機能
// ========================================

// 打設順変更モードを開始
function startSortOrderMode() {
    isSortOrderMode = true;
    
    // ボタンを「打設順変更完了」に変更
    const sortBtn = document.querySelector('.sort-btn');
    if (sortBtn) {
        sortBtn.textContent = '打設順変更完了';
        sortBtn.classList.add('sort-complete-btn');
        sortBtn.classList.remove('sort-btn');
        
        // イベントリスナーを削除して再設定
        const newBtn = sortBtn.cloneNode(true);
        sortBtn.parentNode.replaceChild(newBtn, sortBtn);
        newBtn.addEventListener('click', function() {
            endSortOrderMode();
        });
    }
    
    // order-itemにドラッグ&ドロップ機能を有効化
    enableDragAndDrop();
}

// 打設順変更モードを終了
function endSortOrderMode() {
    isSortOrderMode = false;
    
    // ボタンを「打設順変更」に戻す
    const sortCompleteBtn = document.querySelector('.sort-complete-btn');
    if (sortCompleteBtn) {
        sortCompleteBtn.textContent = '打設順変更';
        sortCompleteBtn.classList.add('sort-btn');
        sortCompleteBtn.classList.remove('sort-complete-btn');
        
        // イベントリスナーを削除して再設定
        const newBtn = sortCompleteBtn.cloneNode(true);
        sortCompleteBtn.parentNode.replaceChild(newBtn, sortCompleteBtn);
        newBtn.addEventListener('click', function() {
            startSortOrderMode();
        });
    }
    
    // order-itemのドラッグ&ドロップ機能を無効化
    disableDragAndDrop();
}

// ドラッグ&ドロップ機能を有効化
function enableDragAndDrop() {
    const orderGrid = document.getElementById('order-grid');
    if (!orderGrid) return;
    
    const orderItems = document.querySelectorAll('#order-grid .order-item');
    orderItems.forEach(item => {
        // 既にドラッグ可能な場合はスキップ
        if (item.draggable) return;
        
        item.draggable = true;
        item.classList.add('draggable');
        
        // ドラッグ開始
        item.addEventListener('dragstart', handleDragStart);
        // ドラッグ中
        item.addEventListener('dragover', handleDragOver);
        // ドラッグ終了
        item.addEventListener('dragend', handleDragEnd);
        // ドロップ
        item.addEventListener('drop', handleDrop);
    });
    
    // order-gridレベルでもdragoverを監視して自動スクロールを維持
    orderGrid.addEventListener('dragover', handleGridDragOver);
}

// ドラッグ&ドロップ機能を無効化
function disableDragAndDrop() {
    const orderGrid = document.getElementById('order-grid');
    if (!orderGrid) return;
    
    // 自動スクロールを停止
    stopAutoScroll();
    
    const orderItems = document.querySelectorAll('#order-grid .order-item');
    orderItems.forEach(item => {
        item.draggable = false;
        item.classList.remove('draggable', 'dragging', 'drag-over');
        
        // イベントリスナーを削除（新しい要素に置き換える）
        const newItem = item.cloneNode(true);
        item.parentNode.replaceChild(newItem, item);
    });
    
    // order-gridのイベントリスナーも削除（新しい要素に置き換える）
    const newOrderGrid = orderGrid.cloneNode(true);
    orderGrid.parentNode.replaceChild(newOrderGrid, orderGrid);
}

// ドラッグ開始時の処理
function handleDragStart(e) {
    draggedElement = this;
    this.classList.add('dragging');
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', this.innerHTML);
}

// ドラッグ中の処理
function handleDragOver(e) {
    if (e.preventDefault) {
        e.preventDefault();
    }
    
    e.dataTransfer.dropEffect = 'move';
    
    // 以前の drag-over 要素からクラスを削除
    if (draggedOverElement && draggedOverElement !== this) {
        draggedOverElement.classList.remove('drag-over');
    }
    
    // ドラッグ中の要素以外の要素にのみ drag-over クラスを追加
    if (this !== draggedElement) {
        this.classList.add('drag-over');
        draggedOverElement = this;
    }
    
    // 自動スクロール処理
    handleAutoScroll(e);
    
    return false;
}

// ドラッグ終了時の処理
function handleDragEnd(e) {
    // 自動スクロールを停止
    stopAutoScroll();
    
    // すべての要素から drag-over クラスを削除
    const orderItems = document.querySelectorAll('#order-grid .order-item');
    orderItems.forEach(item => {
        item.classList.remove('dragging', 'drag-over');
    });
    
    draggedElement = null;
    draggedOverElement = null;
}

// ドロップ時の処理
function handleDrop(e) {
    if (e.stopPropagation) {
        e.stopPropagation();
    }
    
    if (draggedElement !== this) {
        const orderGrid = document.getElementById('order-grid');
        const allItems = Array.from(orderGrid.querySelectorAll('.order-item'));
        const draggedIndex = allItems.indexOf(draggedElement);
        const targetIndex = allItems.indexOf(this);
        
        if (draggedIndex < targetIndex) {
            // 下に移動
            orderGrid.insertBefore(draggedElement, this.nextSibling);
        } else {
            // 上に移動
            orderGrid.insertBefore(draggedElement, this);
        }
    }
    
    // drag-over クラスを削除
    this.classList.remove('drag-over');
    
    // 自動スクロールを停止
    stopAutoScroll();
    
    return false;
}

// order-gridレベルでのdragover処理（自動スクロール用）
function handleGridDragOver(e) {
    if (e.preventDefault) {
        e.preventDefault();
    }
    
    // 自動スクロール処理
    handleAutoScroll(e);
    
    return false;
}

// 自動スクロール処理
function handleAutoScroll(e) {
    const scrollThreshold = 100; // スクロールを開始する画面端からの距離（ピクセル）
    const scrollSpeed = 10; // スクロール速度（ピクセル）
    
    const windowHeight = window.innerHeight;
    const mouseY = e.clientY;
    
    // 既存の自動スクロールを停止
    stopAutoScroll();
    
    // 画面の上端に近い場合
    if (mouseY < scrollThreshold) {
        autoScrollInterval = setInterval(() => {
            window.scrollBy(0, -scrollSpeed);
        }, 16); // 約60fps
    }
    // 画面の下端に近い場合
    else if (mouseY > windowHeight - scrollThreshold) {
        autoScrollInterval = setInterval(() => {
            window.scrollBy(0, scrollSpeed);
        }, 16); // 約60fps
    }
}

// 自動スクロールを停止
function stopAutoScroll() {
    if (autoScrollInterval) {
        clearInterval(autoScrollInterval);
        autoScrollInterval = null;
    }
}

// ========================================
// 注文済みデータ表示機能
// ========================================

// order-data.jsからidで注文データを検索する関数
function findOrderDataById(id, factory, line) {
    if (!orderData || !id) return null;
    
    // 指定されたfactoryとlineから検索
    if (orderData[factory] && orderData[factory][line]) {
        const orders = orderData[factory][line];
        if (Array.isArray(orders)) {
            const foundOrder = orders.find(order => order.id === id);
            if (foundOrder) {
                // orderIndexも一緒に返す
                const orderIndex = orders.indexOf(foundOrder);
                return {
                    order: foundOrder,
                    factory: factory,
                    line: line,
                    orderIndex: orderIndex
                };
            }
        }
    }
    
    // 指定されたfactoryとlineで見つからない場合、全factory/lineから検索
    for (const factoryKey in orderData) {
        for (const lineKey in orderData[factoryKey]) {
            const orders = orderData[factoryKey][lineKey];
            if (Array.isArray(orders)) {
                const foundOrder = orders.find(order => order.id === id);
                if (foundOrder) {
                    const orderIndex = orders.indexOf(foundOrder);
                    return {
                        order: foundOrder,
                        factory: factoryKey,
                        line: lineKey,
                        orderIndex: orderIndex
                    };
                }
            }
        }
    }
    
    return null;
}

// グループデータから注文済みデータのorder-item要素を作成する関数
function createOrderedDataItemElementFromGroup(group, orderDataEntry) {
    const orderItem = document.createElement('div');
    orderItem.className = 'order-item ordered';
    
    const order = orderDataEntry.order;
    const factory = orderDataEntry.factory;
    const line = orderDataEntry.line;
    const orderIndex = orderDataEntry.orderIndex;
    
    // 注文済みデータは常に打設未完了として表示
    const statusHtml = '<button class="status-btn status-incomplete">打設完了</button>';
    
    // 注文済みデータのHTMLを生成（group.concreteTypesを使用）
    const orderedDataHtml = generateOrderedDataHtml(group, order, factory, line, orderIndex);
    
    orderItem.innerHTML = `
        <div class="order-header">
            <h3>${group.projectName}</h3>
            ${statusHtml}
        </div>
        <div class="order-details">
            <div class="floor-info">${group.id}</div>
            <div class="concrete-types">
                ${orderedDataHtml}
            </div>
            <div class="formwork-info">型枠${group.formworkNo}</div>
            <textarea class="memo" placeholder="メモ"></textarea>
        </div>
    `;
    
    // データ属性を設定
    // group.lineを使用（sharedScheduleDataのキーと一致する）
    // orderDataEntry.lineはorder-data.jsの値で、sharedScheduleDataのキーと異なる可能性がある
    const lineForSchedule = group.line || line;
    const factoryForSchedule = group.factory || factory;
    
    orderItem.setAttribute('data-project-name', group.projectName);
    orderItem.setAttribute('data-floor', group.floor);
    orderItem.setAttribute('data-formwork-no', group.formworkNo);
    orderItem.setAttribute('data-order-id', order.id);
    orderItem.setAttribute('data-factory', factoryForSchedule);
    orderItem.setAttribute('data-line', lineForSchedule);
    orderItem.setAttribute('data-order-index', orderIndex);
    orderItem.setAttribute('data-is-ordered', 'true');
    orderItem.setAttribute('data-pouring-status', group.pouringStatus);
    
    return orderItem;
}

// 注文済みデータのHTMLを生成する関数
function generateOrderedDataHtml(group, order, factory, line, orderIndex) {
    const orderTime = order.time || '14:01';
    
    // 注文データのキーを生成
    const orderDataKey = `${factory}_${line}_${orderIndex}`;
    
    // order-data.jsのstrengthを取得
    const orderStrength = order.strength || '';
    
    // group.concreteTypesからHTMLを生成（sharedScheduleDataのvalue/unit配列を使用）
    const concreteTypesHtml = group.concreteTypes.map((ct, ctIndex) => {
        const unit = ct.unit || '';
        const volume = parseFloat(ct.value) || 0;
        
        // 表示用に値を小数点以下1桁に丸める（丸め誤差対策、表示時は小数点第2位まで表示）
        const displayValue = Math.round(volume * 10) / 10;
        
        // order-data.jsのstrengthとshared-schedule-data.jsのunitが一致するかチェック
        const isOrderedUnit = (unit === orderStrength);
        
        // sharedScheduleDataから注文時刻を取得（新しく注文したunitの時刻）
        // group.factoryとgroup.lineを使用（sharedScheduleDataのデータ構造と一致）
        // orderTimesは配列で複数の注文時刻を保持できる
        let scheduleOrderTimes = [];
        const searchFactory = group.factory || factory;
        const searchLine = group.line || line;
        if (searchFactory && searchLine) {
            const projects = sharedScheduleData[searchFactory] && sharedScheduleData[searchFactory][searchLine];
            if (projects && projects[group.projectName]) {
                const projectDataArray = projects[group.projectName];
                projectDataArray.forEach((data, index) => {
                    const dataFormworkNo = data.formworkNo || `No.${index + 1}`;
                    if (dataFormworkNo === group.formworkNo && data.floor === group.floor) {
                        if (data.orderTimes && data.orderTimes[unit]) {
                            // orderTimesが配列の場合はそのまま使用、文字列の場合は配列に変換
                            const times = data.orderTimes[unit];
                            if (Array.isArray(times)) {
                                scheduleOrderTimes = times;
                            } else {
                                scheduleOrderTimes = [times];
                            }
                            console.log('注文時刻を取得しました:', {
                                searchFactory,
                                searchLine,
                                projectName: group.projectName,
                                floor: group.floor,
                                formworkNo: group.formworkNo,
                                unit,
                                scheduleOrderTimes
                            });
                        }
                    }
                });
            }
        }
        
        let html = `
            <div class="concrete-option-wrapper">
                <label class="concrete-option">
                    <input type="checkbox" data-unit="${unit}" data-value="${displayValue}">
                    <span><span class="concrete-unit">${unit}</span><span class="concrete-volume">${displayValue.toFixed(2)}㎥</span></span>
                </label>
        `;
        
        // order-data.jsのstrengthと一致する場合、注文バッチデータを表示
        if (isOrderedUnit) {
            // 1.3㎥ずつに分割
            const batchSize = 1.3;
            const batches = [];
            let remaining = volume;
            
            while (remaining > 0.01) { // 0.01未満の微小な値は無視（丸め誤差対策）
                if (remaining >= batchSize) {
                    batches.push(batchSize);
                    remaining = Math.round((remaining - batchSize) * 10) / 10; // 丸め誤差を防ぐ
                } else {
                    // 残りを小数点以下1桁に丸める
                    const finalBatch = Math.round(remaining * 10) / 10;
                    batches.push(finalBatch);
                    remaining = 0;
                }
            }
            
            html += `
                <div class="order-info">
                    <div class="order-time">注文時刻:${orderTime}</div>
                    <div class="mixing-info-container">
            `;
            
            batches.forEach((batch, batchIndex) => {
                const batchVolume = batch.toFixed(2);
                // バッチデータを取得（存在しない場合は新規作成）
                // 複数のconcreteTypeがある場合を考慮してキーにctIndexを含める
                const batchDataKey = `${orderDataKey}_${ctIndex}_${batchIndex}`;
                const existingBatchData = batchData[batchDataKey];
                const changeRequestVolume = existingBatchData ? existingBatchData.changeRequestVolume : 0;
                
                html += `
                    <div class="mixing-info">
                        <span>${batchVolume}㎥</span>
                        <button class="change-request-btn" 
                                data-factory="${factory}" 
                                data-line="${line}" 
                                data-order-index="${orderIndex}" 
                                data-concrete-type-index="${ctIndex}"
                                data-batch-index="${batchIndex}"
                                data-batch-volume="${batchVolume}"
                                data-unit="${unit}"
                                data-order-data-key="${orderDataKey}">変更依頼</button>
                    </div>
                `;
            });
            
            html += `
                    </div>
            `;
            
            // 追加注文の注文時刻がある場合、既存のmixing-info-containerの下に表示
            // order-data.jsの注文時刻と異なる追加注文時刻のみを表示
            // scheduleOrderTimesにはorder-data.jsの注文時刻も含まれている可能性があるため、重複を避ける
            scheduleOrderTimes.forEach(scheduleOrderTime => {
                if (scheduleOrderTime !== orderTime) {
                    html += `<div class="order-time">注文時刻:${scheduleOrderTime}</div>`;
                }
            });
            
            html += `
                </div>
            `;
        } else if (scheduleOrderTimes.length > 0) {
            // order-data.jsのstrengthと一致しないが、sharedScheduleDataに注文時刻がある場合
            // 注文時刻のみを表示（バッチデータは表示しない）
            scheduleOrderTimes.forEach(scheduleOrderTime => {
                html += `<div class="order-time">注文時刻:${scheduleOrderTime}</div>`;
            });
        }
        
        html += `
            </div>
        `;
        
        return html;
    }).join('');
    
    return concreteTypesHtml;
}

// 変更依頼ボタンのイベント設定
function setupChangeRequestButtonEvents() {
    const orderGrid = document.getElementById('order-grid');
    if (!orderGrid) return;
    
    // 既存のイベントリスナーを削除（重複防止のため）
    const existingHandler = orderGrid.getAttribute('data-change-request-handler');
    if (existingHandler === 'true') {
        const newOrderGrid = orderGrid.cloneNode(true);
        orderGrid.parentNode.replaceChild(newOrderGrid, orderGrid);
        setupChangeRequestButtonEventsOnElement(newOrderGrid);
        return;
    }
    
    // 初回設定
    setupChangeRequestButtonEventsOnElement(orderGrid);
    orderGrid.setAttribute('data-change-request-handler', 'true');
}

// 指定された要素に変更依頼ボタンのイベントリスナーを設定
function setupChangeRequestButtonEventsOnElement(orderGrid) {
    // イベント委譲で変更依頼ボタンのクリックイベントを設定
    orderGrid.addEventListener('click', function(event) {
        const target = event.target;
        if (target.classList.contains('change-request-btn')) {
            handleChangeRequestButtonClick(target);
        }
    });
}

// 変更依頼ボタンのクリック処理
function handleChangeRequestButtonClick(button) {
    const factory = button.getAttribute('data-factory');
    const line = button.getAttribute('data-line');
    const orderIndex = parseInt(button.getAttribute('data-order-index'));
    const concreteTypeIndex = parseInt(button.getAttribute('data-concrete-type-index')) || 0;
    const batchIndex = parseInt(button.getAttribute('data-batch-index'));
    const batchVolume = parseFloat(button.getAttribute('data-batch-volume'));
    const unit = button.getAttribute('data-unit');
    const orderDataKey = button.getAttribute('data-order-data-key');
    
    // 注文データを取得
    const order = orderData[factory][line][orderIndex];
    if (!order) return;
    
    // order-itemからプロジェクト名を取得
    const orderItem = button.closest('.order-item');
    const projectName = orderItem ? orderItem.getAttribute('data-project-name') : null;
    
    // バッチデータを取得または作成（複数のconcreteTypeがある場合を考慮）
    const batchDataKey = `${orderDataKey}_${concreteTypeIndex}_${batchIndex}`;
    const existingBatchData = batchData[batchDataKey];
    const currentChangeRequestVolume = existingBatchData ? existingBatchData.changeRequestVolume : 0;
    
    // モーダルを初期化して表示
    if (typeof initializeChangeRequestModalForOrderedData === 'function') {
        initializeChangeRequestModalForOrderedData({
            factory: factory,
            line: line,
            orderIndex: orderIndex,
            concreteTypeIndex: concreteTypeIndex,
            batchIndex: batchIndex,
            batchVolume: batchVolume,
            orderDataKey: orderDataKey,
            batchDataKey: batchDataKey,
            project: projectName || order.project, // order-itemのプロジェクト名を優先、なければorder.projectを使用
            strength: unit || order.strength, // unitを優先、なければorder.strengthを使用
            currentChangeRequestVolume: currentChangeRequestVolume
        });
    }
    
    // モーダルを表示
    if (typeof showModal === 'function') {
        showModal('change-request-modal');
    }
}
