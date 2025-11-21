// ========================================
// プロジェクトデータ定義
// ========================================

// プロジェクトデータの定義
const projectData = {
    'tochigi-factory': {
        '栃木_建築A北': {
            '〇〇ビル新築工事': [
                { id: '1CX1Y1', status: '打設前検査完了', value: [5.5, 6.12, 2.12, null], unit: ['60N', '30N', '40N', ''], date: 'today', color: 'orange' },
                { id: '1CX1Y2', status: '型枠検査完了', value: [5.8, 6.12, null, null], unit: ['60N', '30N', '', ''], date: 'tomorrow', color: 'yellow' },
                { id: '1CX1Y3', status: '打設前検査完了', value: [5.7, 6.12, null, null], unit: ['60N', '30N', '', ''], date: 'today', color: 'orange' },
                { id: '1CX1Y4', status: '打設完了', value: [5.5, null, null, null], unit: ['60N', '', '', ''], date: 'today', color: 'pink' },
                { id: '1CX1Y5', status: '配筋検査完了', value: [5.8, null, null, null], unit: ['60N', '', '', ''], date: 'tomorrow', color: 'light-yellow' },
                { id: '1CX1Y6', status: '型枠検査完了', value: [5.5, null, null, null], unit: ['60N', '', '', ''], date: 'today', color: 'yellow' },
                { id: '', status: '', value: [null, null, null, null], unit: ['', '', '', ''], date: '', color: 'empty' },
                { id: '', status: '', value: [null, null, null, null], unit: ['', '', '', ''], date: '', color: 'empty' },
                { id: '', status: '', value: [null, null, null, null], unit: ['', '', '', ''], date: '', color: 'empty' },
                { id: '', status: '', value: [null, null, null, null], unit: ['', '', '', ''], date: '', color: 'empty' }
            ],
            '〇〇一丁目': [
                { id: '2GX1Y1', status: '型枠検査完了', value: [3.1, 2.4, 1.1, null], unit: ['70N', '42N', '30N', ''], date: 'tomorrow', color: 'yellow' },
                { id: '2GX1Y2', status: '打設前検査完了', value: [3.1, 2.5, null, null], unit: ['70N', '42N', '', ''], date: 'today', color: 'orange' },
                { id: '2GX1Y3', status: '打設前検査完了', value: [3.4, 2.2, null, null], unit: ['70N', '42N', '', ''], date: 'today', color: 'orange' },
                { id: '', status: '', value: [null, null, null, null], unit: ['', '', '', ''], date: '', color: 'empty' },
                { id: '2GX1Y5', status: '配筋検査完了', value: [3.3, 2.5, null, null], unit: ['70N', '42N', '', ''], date: 'tomorrow', color: 'light-yellow' }
            ],
            '〇〇駅西口再開発': [
                { id: '3EX1Y1', status: '打設前検査完了', value: [4.2, null, null, null], unit: ['60N', '', '', ''], date: 'today', color: 'orange' },
                { id: '3EX1Y2', status: '型枠検査完了', value: [4.5, null, null, null], unit: ['60N', '', '', ''], date: 'tomorrow', color: 'yellow' },
                { id: '3EX1Y3', status: '打設完了', value: [4.8, null, null, null], unit: ['60N', '', '', ''], date: 'today', color: 'pink' },
                { id: '3EX1Y4', status: '配筋検査完了', value: [4.1, null, null, null], unit: ['60N', '', '', ''], date: 'today', color: 'light-yellow' },
                { id: '3EX1Y5', status: '打設前検査完了', value: [4.3, null, null, null], unit: ['60N', '', '', ''], date: 'tomorrow', color: 'orange' },
                { id: '3EX1Y6', status: '型枠検査完了', value: [4.6, null, null, null], unit: ['60N', '', '', ''], date: 'today', color: 'yellow' }
            ]
        }
    },
    'ibaraki-factory': {
        '茨城_Aライン': {
            '〇〇ビル新築工事': [
                { id: '1IX1Y1', status: '打設前検査完了', value: [6.2, null, null, null], unit: ['60N', '', '', ''], date: 'today', color: 'orange' },
                { id: '1IX1Y2', status: '型枠検査完了', value: [6.5, null, null, null], unit: ['60N', '', '', ''], date: 'tomorrow', color: 'yellow' },
                { id: '1IX1Y3', status: '打設前検査完了', value: [6.3, null, null, null], unit: ['60N', '', '', ''], date: 'today', color: 'orange' },
                { id: '1IX1Y4', status: '打設完了', value: [6.1, null, null, null], unit: ['60N', '', '', ''], date: 'today', color: 'pink' },
                { id: '1IX1Y5', status: '配筋検査完了', value: [6.4, null, null, null], unit: ['60N', '', '', ''], date: 'tomorrow', color: 'light-yellow' },
                { id: '1IX1Y6', status: '型枠検査完了', value: [6.0, null, null, null], unit: ['60N', '', '', ''], date: 'today', color: 'yellow' },
                { id: '1IX1Y7', status: '打設前検査完了', value: [6.7, null, null, null], unit: ['60N', '', '', ''], date: 'tomorrow', color: 'orange' },
                { id: '1IX1Y8', status: '型枠検査完了', value: [6.8, null, null, null], unit: ['60N', '', '', ''], date: 'today', color: 'yellow' }
            ],
            '〇〇一丁目': [
                { id: '2IX1Y1', status: '型枠検査完了', value: [3.5, 2.8, null, null], unit: ['TON', '42N', '', ''], date: 'tomorrow', color: 'yellow' },
                { id: '2IX1Y2', status: '打設前検査完了', value: [3.6, 2.9, null, null], unit: ['TON', '42N', '', ''], date: 'today', color: 'orange' },
                { id: '2IX1Y3', status: '打設前検査完了', value: [3.8, 2.6, null, null], unit: ['TON', '42N', '', ''], date: 'today', color: 'orange' },
                { id: '', status: '', value: [null, null, null, null], unit: ['', '', '', ''], date: '', color: 'empty' },
                { id: '2IX1Y5', status: '配筋検査完了', value: [3.7, 2.9, null, null], unit: ['TON', '42N', '', ''], date: 'tomorrow', color: 'light-yellow' }
            ],
            '〇〇駅西口再開発': [
                { id: '3IX1Y1', status: '打設前検査完了', value: [5.2, null, null, null], unit: ['60N', '', '', ''], date: 'today', color: 'orange' },
                { id: '3IX1Y2', status: '型枠検査完了', value: [5.5, null, null, null], unit: ['60N', '', '', ''], date: 'tomorrow', color: 'yellow' },
                { id: '3IX1Y3', status: '打設完了', value: [5.8, null, null, null], unit: ['60N', '', '', ''], date: 'today', color: 'pink' },
                { id: '3IX1Y4', status: '配筋検査完了', value: [5.1, null, null, null], unit: ['60N', '', '', ''], date: 'today', color: 'light-yellow' },
                { id: '3IX1Y5', status: '打設前検査完了', value: [5.3, null, null, null], unit: ['60N', '', '', ''], date: 'tomorrow', color: 'orange' },
                { id: '3IX1Y6', status: '型枠検査完了', value: [5.6, null, null, null], unit: ['60N', '', '', ''], date: 'today', color: 'yellow' },
                { id: '3IX1Y7', status: '打設前検査完了', value: [5.9, null, null, null], unit: ['60N', '', '', ''], date: 'tomorrow', color: 'orange' },
                { id: '3IX1Y8', status: '型枠検査完了', value: [5.4, null, null, null], unit: ['60N', '', '', ''], date: 'today', color: 'yellow' },
                { id: '3IX1Y9', status: '打設完了', value: [5.7, null, null, null], unit: ['60N', '', '', ''], date: 'tomorrow', color: 'pink' },
                { id: '3IX1Y10', status: '配筋検査完了', value: [5.0, null, null, null], unit: ['60N', '', '', ''], date: 'today', color: 'light-yellow' }
            ]
        }
    }
};
