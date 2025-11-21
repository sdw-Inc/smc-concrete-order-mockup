// ========================================
// プラントエリア共通ユーティリティ関数
// ========================================

// データを表示用にフォーマットする関数
function formatMultipleData(value, unit) {
    // 配列データの場合は/で区切って表示
    if (Array.isArray(value) && Array.isArray(unit)) {
        // nullや空文字列を除外して有効なデータのみを取得
        const validValues = value.filter(v => v !== null && v !== undefined && v !== '');
        const validUnits = unit.filter(u => u && u.trim() !== '');
        
        // データが1つだけの場合はそのまま表示
        if (validValues.length <= 1) {
            return {
                value: validValues[0] !== null && validValues[0] !== undefined ? validValues[0].toString() : '',
                unit: validUnits[0] || ''
            };
        }
        
        // 複数データの場合は/で区切って表示
        return {
            value: validValues.map(v => v !== null && v !== undefined ? v.toString() : '').join('/'),
            unit: validUnits.join('/')
        };
    }
    
    // 文字列データの場合はそのまま返す
    if (typeof value === 'string' && typeof unit === 'string') {
        return {
            value: value,
            unit: unit
        };
    }
    
    // その他の場合は空文字列を返す
    return {
        value: '',
        unit: ''
    };
}

// データに基づいて表示を更新する関数
function updateDisplayFromData() {
    const factorySelector = document.querySelector('.factory-selector');
    const lineSelector = document.getElementById('line-selector');
    
    if (!factorySelector || !lineSelector) return;
    
    const factory = factorySelector.value;
    const line = lineSelector.value;
    
    
    if (!sharedScheduleData[factory] || !sharedScheduleData[factory][line]) {
        return;
    }
    
    const projects = sharedScheduleData[factory][line];
    
    // プロジェクトセクションを動的に生成
    generateProjectSections(projects);
    
    // データ表示更新後にdate-cellのクリックイベントを再設定
    setTimeout(() => {
        setupDateCellClickHandlers();
    }, 100);
}

// プロジェクトセクションを動的に生成する関数
function generateProjectSections(projects) {
    const container = document.getElementById('project-sections-container');
    if (!container) return;
    
    // 既存のプロジェクトセクションをクリア
    container.innerHTML = '';
    
    // 各プロジェクトセクションを生成
    Object.keys(projects).forEach(projectName => {
        const projectSection = createProjectSection(projectName, projects[projectName]);
        container.appendChild(projectSection);
    });
}

// プロジェクトセクションを作成する関数
function createProjectSection(projectName, projectDataArray) {
    const projectSection = document.createElement('div');
    projectSection.className = 'project-section';
    
    // プロジェクト名
    const projectNameElement = document.createElement('div');
    projectNameElement.className = 'project-name';
    projectNameElement.textContent = projectName;
    projectSection.appendChild(projectNameElement);
    
    // スケジュールテーブル
    const scheduleTable = document.createElement('div');
    scheduleTable.className = 'schedule-table';
    
    // formworkNoでグループ化（同じformworkNoのtodayとtomorrowを同じ行にまとめる）
    const groupedByFormworkNo = {};
    projectDataArray.forEach((data, index) => {
        // 空のデータ（idが空で、dateも空、または有効なデータがない）をスキップ
        const hasValidData = data.id && data.id.trim() !== '' && 
                            (data.date === 'today' || data.date === 'tomorrow');
        
        if (hasValidData) {
            const formworkNo = data.formworkNo || `No.${index + 1}`;
            if (!groupedByFormworkNo[formworkNo]) {
                groupedByFormworkNo[formworkNo] = {
                    today: null,
                    tomorrow: null,
                    formworkNo: formworkNo,
                    index: Object.keys(groupedByFormworkNo).length
                };
            }
            
            // todayとtomorrowをそれぞれ設定（複数のtodayはない前提）
            if (data.date === 'today') {
                groupedByFormworkNo[formworkNo].today = data;
            } else if (data.date === 'tomorrow') {
                groupedByFormworkNo[formworkNo].tomorrow = data;
            }
        }
    });
    
    // グループ化されたデータから行を生成
    Object.values(groupedByFormworkNo).forEach(group => {
        const scheduleRow = createScheduleRowFromGroup(group);
            scheduleTable.appendChild(scheduleRow);
    });
    
    projectSection.appendChild(scheduleTable);
    return projectSection;
}

// スケジュール行を作成する関数（後方互換性のため残す）
function createScheduleRow(data, index) {
    const scheduleRow = document.createElement('div');
    scheduleRow.className = 'schedule-row';
    
    // 行ラベル
    const rowLabel = document.createElement('div');
    rowLabel.className = 'row-label';
    
    const lineName = document.createElement('div');
    lineName.className = 'line-name';
    // 現在選択されているライン名を取得
    const lineSelector = document.getElementById('line-selector');
    lineName.textContent = lineSelector ? lineSelector.value : '';
    rowLabel.appendChild(lineName);
    
    const noLabel = document.createElement('div');
    noLabel.className = 'no-label';
    // データにformworkNoがある場合はそれを使用、ない場合はインデックス+1から生成
    noLabel.textContent = data.formworkNo || `No.${index + 1}`;
    rowLabel.appendChild(noLabel);
    
    scheduleRow.appendChild(rowLabel);
    
    // 日付セル
    const dateCells = document.createElement('div');
    dateCells.className = 'date-cells';
    
    // 今日のセル
    const todayCell = createDateCell(data, 'today');
    dateCells.appendChild(todayCell);
    
    // 明日のセル
    const tomorrowCell = createDateCell(data, 'tomorrow');
    dateCells.appendChild(tomorrowCell);
    
    scheduleRow.appendChild(dateCells);
    return scheduleRow;
}

// グループ化されたデータからスケジュール行を作成する関数
function createScheduleRowFromGroup(group) {
    const scheduleRow = document.createElement('div');
    scheduleRow.className = 'schedule-row';
    
    // 行ラベル
    const rowLabel = document.createElement('div');
    rowLabel.className = 'row-label';
    
    const lineName = document.createElement('div');
    lineName.className = 'line-name';
    // 現在選択されているライン名を取得
    const lineSelector = document.getElementById('line-selector');
    lineName.textContent = lineSelector ? lineSelector.value : '';
    rowLabel.appendChild(lineName);
    
    const noLabel = document.createElement('div');
    noLabel.className = 'no-label';
    noLabel.textContent = group.formworkNo;
    rowLabel.appendChild(noLabel);
    
    scheduleRow.appendChild(rowLabel);
    
    // 日付セル
    const dateCells = document.createElement('div');
    dateCells.className = 'date-cells';
    
    // 今日のセル（group.todayがあればそのデータを使用、なければnull）
    const todayCell = createDateCell(group.today, 'today');
    dateCells.appendChild(todayCell);
    
    // 明日のセル（group.tomorrowがあればそのデータを使用、なければnull）
    const tomorrowCell = createDateCell(group.tomorrow, 'tomorrow');
    dateCells.appendChild(tomorrowCell);
    
    scheduleRow.appendChild(dateCells);
    return scheduleRow;
}

// 日付セルを作成する関数
function createDateCell(data, dateType) {
    const dateCell = document.createElement('div');
    
    // dataがnullまたはundefinedの場合は空のセルを作成
    if (!data || !data.id || data.date !== dateType) {
        // データがない場合
        dateCell.className = 'date-cell empty';
        dateCell.innerHTML = '';
        return dateCell;
    }
    
        // データがある場合
        dateCell.className = `date-cell ${data.color}`;
        
        // 複数データを/で区切って表示
        const formattedData = formatMultipleData(data.value, data.unit);
        
        dateCell.innerHTML = `
            <div class="status">${data.status}</div>
            <div class="id">${data.id}</div>
            <div class="value">${formattedData.value}</div>
            <div class="unit">${formattedData.unit}</div>
        `;
        
        // data-status属性を設定
        dateCell.setAttribute('data-status', data.status);
    // data-product-id属性を設定（調合No取得用）
    dateCell.setAttribute('data-product-id', data.id);
    // data-date-column属性を設定（日付列の識別用）
    if (data.dateColumn !== undefined) {
        dateCell.setAttribute('data-date-column', data.dateColumn);
    } else {
        const column = dateType === 'today' ? 1 : (dateType === 'tomorrow' ? 2 : 0);
        dateCell.setAttribute('data-date-column', column);
    }
    
    return dateCell;
}

// ========================================
// 複数選択検証処理
// ========================================

// 複数セル選択時の強度比較関数
function canSelectMultipleCells(selectedCells, newCell) {
    // 新しくクリックされたセルの強度を取得
    const newCellUnits = getCellUnits(newCell);
    
    // 新しくクリックされたセルの調合Noを取得
    const newCellMixingNos = getCellMixingNos(newCell);
    
    // 新しくクリックされたセルの工事名を取得
    const newCellProjectName = getCellProjectName(newCell);
    
    // 新しくクリックされたセルの日付を取得
    const newCellDate = getCellDate(newCell);
    
    // 既に選択されているセルの強度、調合No、工事名、日付を取得
    const selectedUnits = [];
    const selectedMixingNos = [];
    const selectedProjectNames = [];
    const selectedDates = [];
    selectedCells.forEach(cell => {
        const units = getCellUnits(cell);
        const mixingNos = getCellMixingNos(cell);
        const projectName = getCellProjectName(cell);
        const date = getCellDate(cell);
        selectedUnits.push(units);
        selectedMixingNos.push(mixingNos);
        selectedProjectNames.push(projectName);
        selectedDates.push(date);
    });
    
    // 日付が同じかチェック
    const hasSameDate = selectedDates.every(date => date === newCellDate);
    if (!hasSameDate) {
        return {
            allowed: false,
            errorMessage: 'すでに選択している製品と同じ日付の製品しか選択できません。'
        };
    }
    
    // 工事名が同じかチェック
    const hasSameProjectName = selectedProjectNames.every(projectName => projectName === newCellProjectName);
    if (!hasSameProjectName) {
        return {
            allowed: false,
            errorMessage: 'すでに選択している製品の工事名と同一の工事名の製品しか選択できません。'
        };
    }
    
    // 既に選択されているセル全体の共通強度を取得
    const commonUnits = getCommonUnits(selectedUnits);
    
    // 新しくクリックされたセルの強度と、既に選択されているセル全体の共通強度を比較
    const hasCommonUnit = hasCommonUnitValue(newCellUnits, commonUnits);
    if (!hasCommonUnit) {
        return {
            allowed: false,
            errorMessage: 'すでに選択している製品の強度と同一の強度が、登録されている製品しか複数選択できません。'
        };
    }
    
    // 調合Noのチェック：共通の強度について、少なくとも1つの強度で調合Noが一致していればOK
    const commonMixingNos = getCommonMixingNos(selectedMixingNos, selectedUnits, commonUnits);
    
    // 新しくクリックされたセルと、既に選択されているセルで、共通の強度かつ調合Noが一致するものが1つでもあるかチェック
    let hasMatchingMixingNo = false;
    for (let i = 0; i < commonUnits.length; i++) {
        const commonUnit = commonUnits[i];
        const commonMixingNo = commonMixingNos[commonUnit];
        
        // 新しくクリックされたセルにこの強度があるかチェック
        const newCellUnitIndex = newCellUnits.findIndex(u => u === commonUnit);
        if (newCellUnitIndex !== -1) {
            const newCellMixingNo = newCellMixingNos[newCellUnitIndex];
            // 調合Noが一致しているかチェック
            if (commonMixingNo && newCellMixingNo === commonMixingNo) {
                hasMatchingMixingNo = true;
                break;
            }
        }
    }
    
    if (!hasMatchingMixingNo) {
        return {
            allowed: false,
            errorMessage: 'すでに選択している製品の強度と調合Noが一致している製品しか複数選択できません。'
        };
    }
    
    return {
        allowed: true,
        errorMessage: ''
    };
}

// 既に選択されているセル全体の共通強度を取得する関数
function getCommonUnits(selectedUnits) {
    if (selectedUnits.length === 0) {
        return [];
    }
    
    if (selectedUnits.length === 1) {
        // 1つのセルの場合は、そのセルの強度を返す
        return selectedUnits[0].filter(unit => unit && unit.trim() !== '');
    }
    
    // 複数のセルの場合は、すべてのセルに共通する強度を返す
    const firstUnits = selectedUnits[0].filter(unit => unit && unit.trim() !== '');
    const commonUnits = [];
    
    for (let i = 0; i < firstUnits.length; i++) {
        const unit = firstUnits[i];
        let isCommon = true;
        
        // 他のすべてのセルにも同じ強度があるかチェック
        for (let j = 1; j < selectedUnits.length; j++) {
            const otherUnits = selectedUnits[j].filter(u => u && u.trim() !== '');
            if (!otherUnits.includes(unit)) {
                isCommon = false;
                break;
            }
        }
        
        if (isCommon) {
            commonUnits.push(unit);
        }
    }
    
    return commonUnits;
}

// セルから工事名を取得する関数
function getCellProjectName(cell) {
    // セルが属するproject-sectionを取得
    const projectSection = cell.closest('.project-section');
    if (!projectSection) {
        return '';
    }
    
    // project-name要素を取得
    const projectNameElement = projectSection.querySelector('.project-name');
    if (!projectNameElement) {
        return '';
    }
    
    return projectNameElement.textContent.trim();
}

// セルから日付を取得する関数
function getCellDate(cell) {
    // セルが属するdate-cellsコンテナを取得
    const dateCellsContainer = cell.closest('.date-cells');
    if (!dateCellsContainer) {
        return '';
    }
    
    // セルが今日のセルか明日のセルかを判定
    const allDateCells = dateCellsContainer.querySelectorAll('.date-cell');
    const cellIndex = Array.from(allDateCells).indexOf(cell);
    
    if (cellIndex === 0) {
        // 最初のセル（今日）
        const todayDateElement = document.getElementById('today-date');
        if (todayDateElement) {
            const dateText = todayDateElement.textContent.trim();
            return dateText;
        }
    } else if (cellIndex === 1) {
        // 2番目のセル（明日）
        const tomorrowDateElement = document.getElementById('tomorrow-date');
        if (tomorrowDateElement) {
            const dateText = tomorrowDateElement.textContent.trim();
            return dateText;
        }
    }
    
    return '';
}

// セルから強度（unit）を取得する関数
function getCellUnits(cell) {
    const unitElements = cell.querySelectorAll('.unit');
    const units = [];
    unitElements.forEach(unitElement => {
        const unitText = unitElement.textContent.trim();
        if (unitText && unitText !== '') {
            // 複数の強度が/で区切られている場合は分割
            if (unitText.includes('/')) {
                const splitUnits = unitText.split('/');
                splitUnits.forEach(unit => {
                    const trimmedUnit = unit.trim();
                    if (trimmedUnit && trimmedUnit !== '') {
                        units.push(trimmedUnit);
                    }
                });
            } else {
                units.push(unitText);
            }
        }
    });
    return units;
}

// セルから元データを取得する関数
function getCellData(cell) {
    const productId = cell.getAttribute('data-product-id');
    if (!productId) {
        return null;
    }
    
    const factorySelector = document.querySelector('.factory-selector');
    const lineSelector = document.getElementById('line-selector');
    if (!factorySelector || !lineSelector) {
        return null;
    }
    
    const factory = factorySelector.value;
    const line = lineSelector.value;
    
    if (!sharedScheduleData[factory] || !sharedScheduleData[factory][line]) {
        return null;
    }
    
    const projects = sharedScheduleData[factory][line];
    
    // プロジェクト名を取得
    const projectName = getCellProjectName(cell);
    if (!projectName || !projects[projectName]) {
        return null;
    }
    
    // 製品IDに一致するデータを検索
    const projectData = projects[projectName];
    const dateColumn = cell.getAttribute('data-date-column');
    
    for (let i = 0; i < projectData.length; i++) {
        const data = projectData[i];
        if (data.id === productId) {
            // dateColumnが一致するかチェック
            const dataDateColumn = data.dateColumn !== undefined ? data.dateColumn : 
                (data.date === 'today' ? 1 : (data.date === 'tomorrow' ? 2 : 0));
            if (dateColumn && dataDateColumn.toString() === dateColumn.toString()) {
                return data;
            }
        }
    }
    
    return null;
}

// セルから調合No（mixingNo）を取得する関数
function getCellMixingNos(cell) {
    const data = getCellData(cell);
    if (!data || !data.mixingNo) {
        return [];
    }
    
    // unitとmixingNoを対応させる
    const units = getCellUnits(cell);
    const mixingNos = [];
    
    if (Array.isArray(data.unit) && Array.isArray(data.mixingNo)) {
        // セルから取得したunitの順序で、対応するmixingNoを取得
        units.forEach(unit => {
            // データのunit配列から該当するunitのインデックスを検索
            const unitIndex = data.unit.findIndex(u => u === unit);
            if (unitIndex !== -1 && data.mixingNo[unitIndex] && data.mixingNo[unitIndex].trim() !== '') {
                mixingNos.push(data.mixingNo[unitIndex]);
            } else {
                mixingNos.push('');
            }
        });
    }
    
    return mixingNos;
}

// 2つの強度配列に共通の値があるかチェックする関数
function hasCommonUnitValue(units1, units2) {
    // 空文字列を除外した有効な強度のみを取得
    const validUnits1 = units1.filter(unit => unit && unit.trim() !== '');
    const validUnits2 = units2.filter(unit => unit && unit.trim() !== '');
    
    for (let i = 0; i < validUnits1.length; i++) {
        for (let j = 0; j < validUnits2.length; j++) {
            if (validUnits1[i] === validUnits2[j]) {
                return true;
            }
        }
    }
    return false;
}

// 共通の強度について、共通の調合Noを取得する関数
function getCommonMixingNos(selectedMixingNos, selectedUnits, commonUnits) {
    if (selectedMixingNos.length === 0 || commonUnits.length === 0) {
        return {};
    }
    
    // 共通の強度ごとに調合Noをマッピング
    const commonMixingNosMap = {};
    
    commonUnits.forEach(commonUnit => {
        const mixingNosForUnit = [];
        
        // 各セルから、共通の強度に対応する調合Noを取得
        for (let i = 0; i < selectedUnits.length; i++) {
            const units = selectedUnits[i];
            const mixingNos = selectedMixingNos[i];
            
            const unitIndex = units.findIndex(u => u === commonUnit);
            if (unitIndex !== -1 && mixingNos[unitIndex]) {
                mixingNosForUnit.push(mixingNos[unitIndex]);
            }
        }
        
        // すべてのセルで同じ調合Noかチェック
        if (mixingNosForUnit.length > 0) {
            const firstMixingNo = mixingNosForUnit[0];
            const allSame = mixingNosForUnit.every(mn => mn === firstMixingNo);
            if (allSame) {
                commonMixingNosMap[commonUnit] = firstMixingNo;
            }
        }
    });
    
    return commonMixingNosMap;
}

// 新しくクリックされたセルの強度と調合Noが、共通の強度と調合Noと一致しているかチェック
function hasCommonMixingNoValue(newCellUnits, newCellMixingNos, commonUnits, commonMixingNos) {
    // 共通の強度ごとにチェック
    for (let i = 0; i < commonUnits.length; i++) {
        const commonUnit = commonUnits[i];
        const commonMixingNo = commonMixingNos[commonUnit];
        
        // 新しくクリックされたセルに共通の強度があるかチェック
        const newCellUnitIndex = newCellUnits.findIndex(u => u === commonUnit);
        if (newCellUnitIndex !== -1) {
            // 調合Noも一致している必要がある
            const newCellMixingNo = newCellMixingNos[newCellUnitIndex];
            if (newCellMixingNo !== commonMixingNo) {
                return false;
            }
        }
    }
    
    return true;
}
