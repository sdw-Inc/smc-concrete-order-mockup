// ========================================
// ラインエリア - メイン初期化処理
// ========================================
document.addEventListener('DOMContentLoaded', function() {
    // 日付表示の初期化
    initializeDateDisplay();
    
    // userIdに基づいてline-selectorを制御（最初に実行 - すべての画面で共通）
    setupLineSelectorByUserId();
    
    // 画面遷移イベントの設定
    setupLineAreaScreenNavigation();
    
    // line-selectorのイベント設定
    setupLineSelectorEvents();
    
    // 現在のページに応じて必要な初期化処理を実行
    const currentPath = window.location.pathname;
    
    // 注文画面の場合
    if (currentPath.includes('order.html')) {
        // モーダル関連のイベント設定
        setupLineAreaModalEvents();
        
        // QRスキャナー関連のイベント設定
        setupLineAreaQRScannerEvents();
        
        // 注文管理の初期化
        initializeLineAreaOrderManagement();
        
        // line-infoを更新
        setTimeout(() => {
            updateLineInfo();
            // line-infoの値を保存
            saveLineInfoValue();
        }, 100);
    }
    
    // 生産指示画面の場合
    if (currentPath.includes('production-instruction.html')) {
        // モーダル関連のイベント設定
        setupLineAreaModalEvents();
        
        // 生産指示画面の初期化
        setTimeout(() => {
            initializeLineProductionInstructionScreen();
            updateLineInfo();
        }, 100);
    }
    
    // バッチ情報画面の場合
    if (currentPath.includes('batch-info.html')) {
        // バッチ情報の初期化
        initializeLineAreaBatchInfo();
        
        // バッチ情報画面の場合、テキストのオーバーフローをチェック
        setTimeout(() => {
            // 保存されたline-infoの値を復元（注文画面の値をそのまま表示）
            const savedLineInfoValue = localStorage.getItem('lineInfoValue');
            if (savedLineInfoValue) {
                restoreLineInfoValue();
            } else {
                // 保存された値がない場合は計算して更新
                updateLineInfo();
            }
            checkBatchInfoTextOverflow();
        }, 100);
    }
});

// ========================================
// 日付表示機能
// ========================================

// 日付表示の初期化
function initializeDateDisplay() {
    updateDateDisplay();
}

// 今日の日付を取得して表示を更新する関数
function updateDateDisplay() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const formattedDate = `${year}/${month}/${day}`;
    
    // すべてのdate-infoクラスの要素を更新
    const dateInfoElements = document.querySelectorAll('.date-info');
    dateInfoElements.forEach(element => {
        element.textContent = formattedDate;
    });
}

// ========================================
// line-info表示更新機能
// ========================================

// line-infoを更新する関数
function updateLineInfo() {
    // .line-selectorと#production-instruction-line-selectorの両方に対応
    const lineSelectors = document.querySelectorAll('.line-selector, #production-instruction-line-selector');
    
    lineSelectors.forEach(lineSelector => {
        if (!lineSelector) return;
        
        let lineName = '';
        
        // production-instruction-line-selectorの場合はvalue属性から取得
        if (lineSelector.id === 'production-instruction-line-selector') {
            lineName = lineSelector.value.trim();
        } else {
            // .line-selectorの場合は選択されたオプションのtextから取得
            const selectedOption = lineSelector.options[lineSelector.selectedIndex];
            if (!selectedOption) return;
            lineName = selectedOption.text.trim();
        }
        
        if (!lineName) return;
        
        const screen = lineSelector.closest('.screen');
        
        // 注文画面の場合は、注文画面に表示されているデータから計算
        if (screen && screen.id === 'order-screen') {
            const lineInfoValue = calculateLineInfoFromOrderScreen(lineName);
            
            const lineInfoElement = screen.querySelector('.line-info');
            if (lineInfoElement) {
                lineInfoElement.textContent = lineInfoValue;
            }
            
            // line-infoの値を保存
            localStorage.setItem('lineInfoValue', lineInfoValue);
            return;
        }
        
        // 生産指示画面とバッチ情報画面の場合は、sharedScheduleDataから計算
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
            // データがない場合は空にする
            if (screen) {
                const lineInfoElement = screen.querySelector('.line-info');
                if (lineInfoElement) {
                    lineInfoElement.textContent = '';
                }
            }
            return;
        }
        
        const projects = sharedScheduleData[factory][targetLineName];
        
        // データ数をカウント（idが空でないデータのみ）
        let dataCount = 0;
        let totalVolume = 0;
        
        Object.keys(projects).forEach(projectName => {
            const projectDataArray = projects[projectName];
            projectDataArray.forEach(data => {
                // idが空でないデータのみカウント
                if (data.id && data.id.trim() !== '') {
                    dataCount++;
                    
                    // value配列から総量を計算
                    if (Array.isArray(data.value)) {
                        data.value.forEach((val) => {
                            if (val !== null && val !== undefined && val !== '') {
                                totalVolume += parseFloat(val) || 0;
                            }
                        });
                    }
                }
            });
        });
        
        // line-infoの値を計算
        const lineInfoValue = dataCount > 0 && totalVolume > 0 ? ` ${dataCount}P ${totalVolume.toFixed(2)}㎥` : '';
        
        // line-infoを更新（同じline-selectorを持つ画面内のline-infoを更新）
        if (screen) {
            // バッチ情報画面の場合は更新しない（注文画面の値を保持）
            if (screen.id === 'batch-info-screen') {
                return;
            }
            
            const lineInfoElement = screen.querySelector('.line-info');
            if (lineInfoElement) {
                lineInfoElement.textContent = lineInfoValue;
            }
        } else {
            // screenが見つからない場合は、バッチ情報画面以外のline-infoを更新
            const lineInfoElements = document.querySelectorAll('.line-info');
            lineInfoElements.forEach(element => {
                const elementScreen = element.closest('.screen');
                if (elementScreen && elementScreen.id !== 'batch-info-screen') {
                    element.textContent = lineInfoValue;
                }
            });
        }
    });
}

// 注文画面に表示されているデータからline-infoを計算する関数
function calculateLineInfoFromOrderScreen(lineName) {
    const orderGrid = document.getElementById('order-grid');
    if (!orderGrid) return '';
    
    // 茨城_B1ラインと茨城_B2ラインの場合は、茨城_Aラインのデータも参照
    const targetLines = [lineName];
    if (lineName === '茨城_B1ライン' || lineName === '茨城_B2ライン') {
        targetLines.push('茨城_Aライン');
    }
    
    // 選択されたラインに基づいて、注文画面に表示されているデータをフィルタリング
    const orderItems = orderGrid.querySelectorAll('.order-item');
    let dataCount = 0;
    let totalVolume = 0;
    
    orderItems.forEach(item => {
        // データ属性からラインを取得
        const itemLine = item.getAttribute('data-line');
        
        // 選択されたラインと一致するアイテムのみをカウント
        if (targetLines.includes(itemLine)) {
            // 表示されているアイテムのみをカウント（display: noneのものは除外）
            const computedStyle = window.getComputedStyle(item);
            if (computedStyle.display === 'none') {
                return;
            }
            
            // データ数をカウント（1アイテム = 1P）
            dataCount++;
            
            // コンクリート種類のvalue総量を計算
            const concreteOptions = item.querySelectorAll('.concrete-option');
            concreteOptions.forEach(option => {
                const span = option.querySelector('span');
                if (span) {
                    // "60N 5.5㎥" のような形式から数値を抽出
                    const text = span.textContent.trim();
                    const match = text.match(/(\d+\.?\d*)\s*㎥/);
                    if (match) {
                        totalVolume += parseFloat(match[1]) || 0;
                    }
                }
            });
        }
    });
    
    // line-infoの値を計算
    return dataCount > 0 && totalVolume > 0 ? ` ${dataCount}P ${totalVolume.toFixed(2)}㎥` : '';
}

// userIdに基づいてline-selectorを制御する関数
function setupLineSelectorByUserId() {
    const userId = localStorage.getItem('userId');
    if (!userId) return;
    
    // すべてのline-selectorを取得（.line-selectorと#production-instruction-line-selectorの両方）
    const lineSelectors = document.querySelectorAll('.line-selector, #production-instruction-line-selector');
    
    lineSelectors.forEach(lineSelector => {
        if (!lineSelector) return;
        
        if (userId === '000') {
            // ユーザID000の場合：栃木_建築A北に固定し、選択不可にする
            const targetLine = '栃木_建築A北';
            
            // オプションをクリア
            lineSelector.innerHTML = '';
            
            // 栃木_建築A北のみを追加
            const option = document.createElement('option');
            option.value = targetLine;
            option.textContent = targetLine;
            option.selected = true;
            lineSelector.appendChild(option);
            
            // 選択不可にする
            lineSelector.disabled = true;
            
            // localStorageに保存
            localStorage.setItem('selectedLineName', targetLine);
            
        } else if (userId === '111') {
            // ユーザID111の場合：茨城_B1ラインに初期設定、B1/B2のみ選択可能
            const allowedLines = ['茨城_B1ライン', '茨城_B2ライン'];
            const defaultLine = '茨城_B1ライン';
            
            // オプションをクリア
            lineSelector.innerHTML = '';
            
            // 許可されたラインのみを追加
            allowedLines.forEach(lineName => {
                const option = document.createElement('option');
                option.value = lineName;
                option.textContent = lineName;
                if (lineName === defaultLine) {
                    option.selected = true;
                }
                lineSelector.appendChild(option);
            });
            
            // 選択可能にする
            lineSelector.disabled = false;
            
            // localStorageに保存
            localStorage.setItem('selectedLineName', defaultLine);
        }
    });
}

// line-selectorのイベント設定
function setupLineSelectorEvents() {
    // userIdに基づいてline-selectorを制御（DOMContentLoadedで既に実行されているが、念のため再実行）
    setupLineSelectorByUserId();
    
    // .line-selectorと#production-instruction-line-selectorの両方に対応
    const lineSelectors = document.querySelectorAll('.line-selector, #production-instruction-line-selector');
    
    const userId = localStorage.getItem('userId');
    const isUserIdControlled = userId === '000' || userId === '111';
    
    lineSelectors.forEach(lineSelector => {
        // production-instruction-line-selectorの場合は、既にproduction-instruction.jsでイベントが設定されているのでスキップ
        if (lineSelector.id === 'production-instruction-line-selector') {
            return;
        }
        
        // 既存のイベントリスナーを削除するために、新しい要素で置き換え
        const newLineSelector = lineSelector.cloneNode(true);
        lineSelector.parentNode.replaceChild(newLineSelector, lineSelector);
    });
    
    // userId制御を再適用（クローン処理で設定が失われるため）
    if (isUserIdControlled) {
        setupLineSelectorByUserId();
    } else {
        // 保存されたライン選択状態を復元（userId制御が適用されていない場合のみ）
        restoreLineSelectorState();
    }
    
    // イベントリスナーを追加
    const updatedLineSelectors = document.querySelectorAll('.line-selector, #production-instruction-line-selector');
    updatedLineSelectors.forEach(lineSelector => {
        // production-instruction-line-selectorの場合は、既にproduction-instruction.jsでイベントが設定されているのでスキップ
        if (lineSelector.id === 'production-instruction-line-selector') {
            return;
        }
        
        // 無効化されている場合はイベントを追加しない
        if (lineSelector.disabled) {
            return;
        }
        
        lineSelector.addEventListener('change', function() {
            // 選択されたライン情報をlocalStorageに保存
            const selectedOption = this.options[this.selectedIndex];
            if (selectedOption) {
                const lineName = selectedOption.text.trim();
                localStorage.setItem('selectedLineName', lineName);
            }
            
            // バッチ情報画面の場合は、line-infoを更新しない（注文画面の値を保持）
            const currentPath = window.location.pathname;
            const screen = this.closest('.screen');
            if (screen && screen.id === 'batch-info-screen') {
                // バッチ情報画面では何もしない
                return;
            }
            
            // 注文画面の場合は、注文アイテムを再生成してフィルタリング
            if (screen && screen.id === 'order-screen') {
                if (typeof generateOrderItems === 'function') {
                    generateOrderItems();
                }
            }
            
            updateLineInfo();
            // line-infoの値を保存
            saveLineInfoValue();
        });
    });
    
    // 初期表示を更新（バッチ情報画面の場合は後で復元するのでスキップ）
    const currentPath = window.location.pathname;
    if (!currentPath.includes('batch-info.html')) {
        updateLineInfo();
        // 注文画面の場合は値を保存
        if (currentPath.includes('order.html')) {
            setTimeout(() => {
                saveLineInfoValue();
            }, 150);
        }
    }
}

// 保存されたライン選択状態を復元する関数
function restoreLineSelectorState() {
    const savedLineName = localStorage.getItem('selectedLineName');
    if (!savedLineName) return;
    
    // .line-selectorのすべての要素を取得
    const lineSelectors = document.querySelectorAll('.line-selector');
    
    lineSelectors.forEach(lineSelector => {
        // オプションを検索して、保存されたライン名と一致するものを選択
        for (let i = 0; i < lineSelector.options.length; i++) {
            const option = lineSelector.options[i];
            if (option.text.trim() === savedLineName) {
                lineSelector.selectedIndex = i;
                break;
            }
        }
    });
}

// line-infoの値を保存する関数
function saveLineInfoValue() {
    const orderScreen = document.getElementById('order-screen');
    if (orderScreen) {
        const lineInfoElement = orderScreen.querySelector('.line-info');
        if (lineInfoElement) {
            localStorage.setItem('lineInfoValue', lineInfoElement.textContent);
        }
    }
}

// 保存されたline-infoの値を復元する関数
function restoreLineInfoValue() {
    const savedLineInfoValue = localStorage.getItem('lineInfoValue');
    if (!savedLineInfoValue) return;
    
    // バッチ情報画面のline-infoを更新
    const batchInfoScreen = document.getElementById('batch-info-screen');
    if (batchInfoScreen) {
        const lineInfoElement = batchInfoScreen.querySelector('.line-info');
        if (lineInfoElement) {
            lineInfoElement.textContent = savedLineInfoValue;
        }
    }
}
