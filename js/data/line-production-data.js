// ========================================
// ラインエリア用 生産指示データ定義
// ========================================

// ラインエリア用プロジェクトデータの定義
const lineProductionData = {
    '栃木_建築A北': {
        '〇〇駅西口再開発': [
            { id: '1CX1Y1', status: '打設前検査完了', value: [5.5, 3.12], unit: ['30N','20N'], date: 'today', color: 'orange' },
            { id: '1CX1Y2', status: '型枠検査完了', value: [5.8], unit: ['60N'], date: 'tomorrow', color: 'yellow' },
            { id: '1CX1Y3', status: '打設前検査完了', value: [5.7, 3.12], unit: ['60N','30N'], date: 'today', color: 'orange' },
            { id: '1CX1Y4', status: '打設完了', value: [5.5], unit: ['60N'], date: 'today', color: 'pink' },
            { id: '1CX1Y5', status: '配筋検査完了', value: [5.8], unit: ['60N'], date: 'tomorrow', color: 'light-yellow' },
            { id: '1CX1Y6', status: '型枠検査完了', value: [5.5], unit: ['60N'], date: 'today', color: 'yellow' },
            { id: '1CX1Y7', status: '打設前検査完了', value: [5.6, 3.12, 2.12], unit: ['60N','30N','20N'], date: 'tomorrow', color: 'orange' },
            { id: '', status: '', value: [null], unit: [''], date: '', color: 'empty' },
            { id: '', status: '', value: [null], unit: [''], date: '', color: 'empty' }
        ],
        '〇〇一丁目': [
            { id: '1CX1Y1', status: '打設前検査完了', value: [5.5, 6.12, 2.12], unit: ['60N', '30N', '40N'], date: 'today', color: 'orange' },
            { id: '1CX1Y2', status: '型枠検査完了', value: [5.8, 6.12], unit: ['60N', '30N'], date: 'tomorrow', color: 'yellow' },
            { id: '1CX1Y3', status: '打設前検査完了', value: [5.7, 6.12], unit: ['60N', '30N'], date: 'today', color: 'orange' },
            { id: '1CX1Y4', status: '打設完了', value: [5.5], unit: ['60N'], date: 'today', color: 'pink' },
            { id: '1CX1Y5', status: '配筋検査完了', value: [5.8], unit: ['60N'], date: 'tomorrow', color: 'light-yellow' },
            { id: '1CX1Y6', status: '型枠検査完了', value: [5.5], unit: ['60N'], date: 'today', color: 'yellow' },
            { id: '1CX1Y7', status: '打設前検査完了', value: [5.6], unit: ['60N'], date: 'tomorrow', color: 'orange' },
            { id: '', status: '', value: [null], unit: [''], date: '', color: 'empty' },
            { id: '', status: '', value: [null], unit: [''], date: '', color: 'empty' }
        ]
    },
    '栃木_建築B北': {
        '〇〇ビル新築工事': [
            { id: '2CX1Y1', status: '打設前検査完了', value: [6.2], unit: ['60N'], date: 'today', color: 'orange' },
            { id: '2CX1Y2', status: '型枠検査完了', value: [6.5], unit: ['60N'], date: 'tomorrow', color: 'yellow' },
            { id: '2CX1Y3', status: '打設前検査完了', value: [6.3], unit: ['60N'], date: 'today', color: 'orange' },
            { id: '2CX1Y4', status: '打設完了', value: [6.1], unit: ['60N'], date: 'today', color: 'pink' },
            { id: '2CX1Y5', status: '配筋検査完了', value: [6.4], unit: ['60N'], date: 'tomorrow', color: 'light-yellow' },
            { id: '2CX1Y6', status: '型枠検査完了', value: [6.0], unit: ['60N'], date: 'today', color: 'yellow' },
            { id: '', status: '', value: [null], unit: [''], date: '', color: 'empty' },
            { id: '', status: '', value: [null], unit: [''], date: '', color: 'empty' },
            { id: '', status: '', value: [null], unit: [''], date: '', color: 'empty' }
        ]
    },
    '茨城_Aライン': {
        '〇〇駅西口再開発': [
            { id: '1CX1Y1', status: '打設前検査完了', value: [5.5], unit: ['60N'], date: 'today', color: 'orange' },
            { id: '1CX1Y2', status: '型枠検査完了', value: [5.8], unit: ['60N'], date: 'tomorrow', color: 'yellow' },
            { id: '1CX1Y3', status: '打設前検査完了', value: [5.7], unit: ['60N'], date: 'today', color: 'orange' },
            { id: '1CX1Y4', status: '打設完了', value: [5.5], unit: ['60N'], date: 'today', color: 'pink' },
            { id: '1CX1Y5', status: '配筋検査完了', value: [5.8], unit: ['60N'], date: 'tomorrow', color: 'light-yellow' },
            { id: '1CX1Y6', status: '型枠検査完了', value: [5.5], unit: ['60N'], date: 'today', color: 'yellow' },
            { id: '1CX1Y7', status: '打設前検査完了', value: [5.6], unit: ['60N'], date: 'tomorrow', color: 'orange' },
            { id: '', status: '', value: [null], unit: [''], date: '', color: 'empty' },
            { id: '', status: '', value: [null], unit: [''], date: '', color: 'empty' }
        ],
        '〇〇一丁目': [
            { id: '1CX1Y1', status: '打設前検査完了', value: [5.5, 6.12, 2.12], unit: ['60N', '30N', '40N'], date: 'today', color: 'orange' },
            { id: '1CX1Y2', status: '型枠検査完了', value: [5.8, 6.12], unit: ['60N', '30N'], date: 'tomorrow', color: 'yellow' },
            { id: '1CX1Y3', status: '打設前検査完了', value: [5.7, 6.12], unit: ['60N', '30N'], date: 'today', color: 'orange' },
            { id: '1CX1Y4', status: '打設完了', value: [5.5], unit: ['60N'], date: 'today', color: 'pink' },
            { id: '1CX1Y5', status: '配筋検査完了', value: [5.8], unit: ['60N'], date: 'tomorrow', color: 'light-yellow' },
            { id: '1CX1Y6', status: '型枠検査完了', value: [5.5], unit: ['60N'], date: 'today', color: 'yellow' },
            { id: '1CX1Y7', status: '打設前検査完了', value: [5.6], unit: ['60N'], date: 'tomorrow', color: 'orange' },
            { id: '', status: '', value: [null], unit: [''], date: '', color: 'empty' },
            { id: '', status: '', value: [null], unit: [''], date: '', color: 'empty' }
        ]
    },
    '茨城_B1ライン': {
        '〇〇ビル新築工事': [
            { id: '2CX1Y1', status: '打設前検査完了', value: [6.2], unit: ['60N'], date: 'today', color: 'orange' },
            { id: '2CX1Y2', status: '型枠検査完了', value: [6.5], unit: ['60N'], date: 'tomorrow', color: 'yellow' },
            { id: '2CX1Y3', status: '打設前検査完了', value: [6.3], unit: ['60N'], date: 'today', color: 'orange' },
            { id: '2CX1Y4', status: '打設完了', value: [6.1], unit: ['60N'], date: 'today', color: 'pink' },
            { id: '2CX1Y5', status: '配筋検査完了', value: [6.4], unit: ['60N'], date: 'tomorrow', color: 'light-yellow' },
            { id: '2CX1Y6', status: '型枠検査完了', value: [6.0], unit: ['60N'], date: 'today', color: 'yellow' },
            { id: '', status: '', value: [null], unit: [''], date: '', color: 'empty' },
            { id: '', status: '', value: [null], unit: [''], date: '', color: 'empty' },
            { id: '', status: '', value: [null], unit: [''], date: '', color: 'empty' }
        ]
    }
};

