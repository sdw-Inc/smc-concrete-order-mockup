// ========================================
// 共通スケジュールデータ定義
// ========================================

// 共通スケジュールデータの定義
// プラントエリアのschedule-tableのデータ構造を基準に統一
const sharedScheduleData = {
    'tochigi-factory': {
        '栃木_建築A北': {
            '〇〇ビル新築工事': [
                { id: '1CX1Y1', status: '打設前検査完了', value: [5.5, 6.12, 2.12, null], unit: ['60N', '30N', '40N', ''], mixingNo: ['66666', '77777', '88888', ''], date: 'today', dateColumn: 1, color: 'orange', pouringStatus: 'incomplete', formworkNo: 'No.1', floor: '1F' },
                { id: '1CX1Y2', status: '型枠検査完了', value: [5.8, 6.12, null, null], unit: ['60N', '30N', '', ''], mixingNo: ['66666', '77777', '', ''], date: 'tomorrow', dateColumn: 2, color: 'yellow', pouringStatus: 'incomplete', formworkNo: 'No.2', floor: '1F' },
                { id: '1CX1Y3', status: '配筋検査完了', value: [5.7, 6.12, null, null], unit: ['60N', '30N', '', ''], mixingNo: ['66666', '77777', '', ''], date: 'today', dateColumn: 1, color: 'light-yellow', pouringStatus: 'incomplete', formworkNo: 'No.3', floor: '1F'},
                { id: '1CX1Y4', status: '打設完了', value: [5.5, 3.5, null, null], unit: ['60N', '30N', '', ''], mixingNo: ['77777', '77777', '', ''], date: 'today', dateColumn: 1, color: 'pink', pouringStatus: 'completed', formworkNo: 'No.4', floor: '1F',orderTimes: { '60N': '14:01' }},
                { id: '1CX1Y5', status: '配筋検査完了', value: [5.8, null, null, null], unit: ['60N', '', '', ''], mixingNo: ['66666', '', '', ''], date: 'tomorrow', dateColumn: 2, color: 'light-yellow', pouringStatus: 'incomplete', formworkNo: 'No.4', floor: '1F' },
                { id: '1CX1Y6', status: '打設完了', value: [5.5, null, null, null], unit: ['36N', '', '', ''], mixingNo: ['99999', '', '', ''], date: 'today', dateColumn: 1, color: 'pink', pouringStatus: 'completed', formworkNo: 'No.6', floor: '1F' ,orderTimes: { '36N': '14:01'}},
                { id: '1CX1Y7', status: '打設前検査完了', value: [5.9, null, null, null], unit: ['60N', '', '', ''], mixingNo: ['66666', '', '', ''], date: 'today', dateColumn: 1, color: 'orange', pouringStatus: 'incomplete', formworkNo: 'No.8', floor: '1F' },
                { id: '1CX1Y8', status: '打設前検査完了', value: [6.0, null, null, null], unit: ['60N', '', '', ''], mixingNo: ['66666', '', '', ''], date: 'today', dateColumn: 1, color: 'orange', pouringStatus: 'incomplete', formworkNo: 'No.10', floor: '1F' },
                { id: '', status: '', value: [null, null, null, null], unit: ['', '', '', ''], mixingNo: ['', '', '', ''], date: '', dateColumn: 0, color: 'empty', pouringStatus: 'incomplete', formworkNo: '', floor: '' },
                { id: '', status: '', value: [null, null, null, null], unit: ['', '', '', ''], mixingNo: ['', '', '', ''], date: '', dateColumn: 0, color: 'empty', pouringStatus: 'incomplete', formworkNo: '', floor: '' },
                { id: '', status: '', value: [null, null, null, null], unit: ['', '', '', ''], mixingNo: ['', '', '', ''], date: '', dateColumn: 0, color: 'empty', pouringStatus: 'incomplete', formworkNo: '', floor: '' }
            ],
            '〇〇一丁目': [
                { id: '2GX1Y1', status: '型枠検査完了', value: [3.1, 2.4, 1.1, null], unit: ['70N', '42N', '30N', ''], mixingNo: ['11111', '22222', '33333', ''], date: 'tomorrow', dateColumn: 2, color: 'yellow', pouringStatus: 'incomplete', formworkNo: 'No.1', floor: '2F' },
                { id: '2GX1Y2', status: '打設前検査完了', value: [3.1, 2.5, null, null], unit: ['70N', '42N', '', ''], mixingNo: ['11111', '22222', '', ''], date: 'today', dateColumn: 1, color: 'orange', pouringStatus: 'incomplete', formworkNo: 'No.2', floor: '2F' },
                { id: '2GX1Y3', status: '打設前検査完了', value: [3.4, 2.2, null, null], unit: ['70N', '42N', '', ''], mixingNo: ['11111', '22222', '', ''], date: 'today', dateColumn: 1, color: 'orange', pouringStatus: 'incomplete', formworkNo: 'No.3', floor: '2F' },
                { id: '', status: '', value: [null, null, null, null], unit: ['', '', '', ''], mixingNo: ['', '', '', ''], date: '', dateColumn: 0, color: 'empty', pouringStatus: 'incomplete', formworkNo: '', floor: '' },
                { id: '2GX1Y5', status: '配筋検査完了', value: [3.3, 2.5, null, null], unit: ['70N', '42N', '', ''], mixingNo: ['11111', '22222', '', ''], date: 'tomorrow', dateColumn: 2, color: 'light-yellow', pouringStatus: 'incomplete', formworkNo: 'No.5', floor: '2F' }
            ],
            '〇〇駅西口再開発': [
                { id: '3EX1Y1', status: '打設前検査完了', value: [4.2, null, null, null], unit: ['60N', '', '', ''], mixingNo: ['66666', '', '', ''], date: 'today', dateColumn: 1, color: 'orange', pouringStatus: 'incomplete', formworkNo: 'No.1', floor: '3F' },
                { id: '3EX1Y2', status: '型枠検査完了', value: [4.5, null, null, null], unit: ['60N', '', '', ''], mixingNo: ['66666', '', '', ''], date: 'tomorrow', dateColumn: 2, color: 'yellow', pouringStatus: 'incomplete', formworkNo: 'No.2', floor: '3F' },
                { id: '3EX1Y3', status: '打設完了', value: [4.8, null, null, null], unit: ['60N', '', '', ''], mixingNo: ['66666', '', '', ''], date: 'today', dateColumn: 1, color: 'pink', pouringStatus: 'completed', formworkNo: 'No.3', floor: '3F' ,orderTimes: { '60N': '14:31'}},
                { id: '3EX1Y4', status: '配筋検査完了', value: [4.1, null, null, null], unit: ['60N', '', '', ''], mixingNo: ['66666', '', '', ''], date: 'today', dateColumn: 1, color: 'light-yellow', pouringStatus: 'incomplete', formworkNo: 'No.4', floor: '3F' },
                { id: '3EX1Y5', status: '打設前検査完了', value: [4.3, null, null, null], unit: ['60N', '', '', ''], mixingNo: ['66666', '', '', ''], date: 'tomorrow', dateColumn: 2, color: 'orange', pouringStatus: 'incomplete', formworkNo: 'No.5', floor: '3F' },
                { id: '3EX1Y6', status: '型枠検査完了', value: [4.6, null, null, null], unit: ['60N', '', '', ''], mixingNo: ['66666', '', '', ''], date: 'today', dateColumn: 1, color: 'yellow', pouringStatus: 'incomplete', formworkNo: 'No.6', floor: '3F' },
                { id: '3EX1Y7', status: '打設前検査完了', value: [4.6, null, null, null], unit: ['60N', '', '', ''], mixingNo: ['66666', '', '', ''], date: 'today', dateColumn: 1, color: 'orange', pouringStatus: 'incomplete', formworkNo: 'No.7', floor: '3F' }
            ]
        }
    },
    'ibaraki-factory': {
        '茨城_Aライン': {
            '〇〇ビル新築工事': [
                { id: '1IX1Y1', status: '打設前検査完了', value: [6.2, 5.0, 4.5, null], unit: ['60N', '36N', '45N', ''], mixingNo: ['66666', '99999', '44444', ''], date: 'today', dateColumn: 1, color: 'orange', pouringStatus: 'incomplete', formworkNo: 'No.1', floor: '1F' },
                { id: '1IX1Y2', status: '型枠検査完了', value: [6.5, 3.5, null, null], unit: ['60N', '45N', '', ''], mixingNo: ['66666', '44444', '', ''], date: 'tomorrow', dateColumn: 2, color: 'yellow', pouringStatus: 'incomplete', formworkNo: 'No.2', floor: '1F' },
                { id: '1IX1Y3', status: '打設前検査完了', value: [6.3, 3.5, null, null], unit: ['60N', '45N', '', ''], mixingNo: ['66666', '44444', '', ''], date: 'today', dateColumn: 1, color: 'orange', pouringStatus: 'incomplete', formworkNo: 'No.3', floor: '1F' },
                { id: '1IX1Y4', status: '打設完了', value: [6.1, 3.5, null, null], unit: ['60N', '45N', '', ''], mixingNo: ['77777', '44444', '', ''], date: 'today', dateColumn: 1, color: 'pink', pouringStatus: 'completed', formworkNo: 'No.4', floor: '1F',orderTimes: { '60N': '11:12'}},
                { id: '1IX1Y5', status: '配筋検査完了', value: [6.4, null, null, null], unit: ['60N', '', '', ''], mixingNo: ['66666', '', '', ''], date: 'tomorrow', dateColumn: 2, color: 'light-yellow', pouringStatus: 'incomplete', formworkNo: 'No.4', floor: '1F' },
                { id: '1IX1Y6', status: '型枠検査完了', value: [6.0, null, null, null], unit: ['36N', '', '', ''], mixingNo: ['99999', '', '', ''], date: 'today', dateColumn: 1, color: 'yellow', pouringStatus: 'incomplete', formworkNo: 'No.6', floor: '1F' },
                { id: '1IX1Y7', status: '打設前検査完了', value: [6.7, null, null, null], unit: ['60N', '', '', ''], mixingNo: ['66666', '', '', ''], date: 'tomorrow', dateColumn: 2, color: 'orange', pouringStatus: 'incomplete', formworkNo: 'No.7', floor: '1F' },
                { id: '1IX1Y8', status: '型枠検査完了', value: [6.8, null, null, null], unit: ['36N', '', '', ''], mixingNo: ['99999', '', '', ''], date: 'today', dateColumn: 1, color: 'yellow', pouringStatus: 'incomplete', formworkNo: 'No.8', floor: '1F' },
                { id: '1IX1Y9', status: '打設前検査完了', value: [6.9, null, null, null], unit: ['60N', '', '', ''], mixingNo: ['66666', '', '', ''], date: 'today', dateColumn: 1, color: 'orange', pouringStatus: 'incomplete', formworkNo: 'No.9', floor: '1F' },
                { id: '1IX1Y10', status: '打設前検査完了', value: [7.0, null, null, null], unit: ['60N', '', '', ''], mixingNo: ['66666', '', '', ''], date: 'today', dateColumn: 1, color: 'orange', pouringStatus: 'incomplete', formworkNo: 'No.10', floor: '1F' }
            ],
            '〇〇一丁目': [
                { id: '2IX1Y1', status: '型枠検査完了', value: [3.5, 2.8, null, null], unit: ['70N', '42N', '', ''], mixingNo: ['11111', '22222', '', ''], date: 'tomorrow', dateColumn: 2, color: 'yellow', pouringStatus: 'incomplete', formworkNo: 'No.1', floor: '2F' },
                { id: '2IX1Y2', status: '打設前検査完了', value: [3.6, 2.9, null, null], unit: ['70N', '42N', '', ''], mixingNo: ['11111', '22222', '', ''], date: 'today', dateColumn: 1, color: 'orange', pouringStatus: 'incomplete', formworkNo: 'No.2', floor: '2F' },
                { id: '2IX1Y3', status: '打設前検査完了', value: [3.8, 2.6, null, null], unit: ['70N', '42N', '', ''], mixingNo: ['11111', '22222', '', ''], date: 'today', dateColumn: 1, color: 'orange', pouringStatus: 'incomplete', formworkNo: 'No.3', floor: '2F' },
                { id: '', status: '', value: [null, null, null, null], unit: ['', '', '', ''], mixingNo: ['', '', '', ''], date: '', dateColumn: 0, color: 'empty', pouringStatus: 'incomplete', formworkNo: '', floor: '' },
                { id: '2IX1Y5', status: '配筋検査完了', value: [3.7, 2.9, null, null], unit: ['70N', '42N', '', ''], mixingNo: ['11111', '22222', '', ''], date: 'tomorrow', dateColumn: 2, color: 'light-yellow', pouringStatus: 'incomplete', formworkNo: 'No.5', floor: '2F' }
            ],
            '〇〇駅西口再開発': [
                { id: '3IX1Y1', status: '打設前検査完了', value: [5.2, null, null, null], unit: ['60N', '', '', ''], mixingNo: ['66666', '', '', ''], date: 'today', dateColumn: 1, color: 'orange', pouringStatus: 'incomplete', formworkNo: 'No.1', floor: '3F' },
                { id: '3IX1Y2', status: '型枠検査完了', value: [5.5, null, null, null], unit: ['60N', '', '', ''], mixingNo: ['66666', '', '', ''], date: 'tomorrow', dateColumn: 2, color: 'yellow', pouringStatus: 'incomplete', formworkNo: 'No.1', floor: '3F' },
                { id: '3IX1Y3', status: '打設完了', value: [5.8, null, null, null], unit: ['60N', '', '', ''], mixingNo: ['66666', '', '', ''], date: 'today', dateColumn: 1, color: 'pink', pouringStatus: 'completed', formworkNo: 'No.3', floor: '3F',orderTimes: { '60N': '13:22' }},
                { id: '3IX1Y4', status: '配筋検査完了', value: [5.1, null, null, null], unit: ['60N', '', '', ''], mixingNo: ['66666', '', '', ''], date: 'today', dateColumn: 1, color: 'light-yellow', pouringStatus: 'incomplete', formworkNo: 'No.4', floor: '3F' },
                { id: '3IX1Y5', status: '打設前検査完了', value: [5.3, null, null, null], unit: ['60N', '', '', ''], mixingNo: ['66666', '', '', ''], date: 'tomorrow', dateColumn: 2, color: 'orange', pouringStatus: 'incomplete', formworkNo: 'No.5', floor: '3F' },
                { id: '3IX1Y6', status: '型枠検査完了', value: [5.6, null, null, null], unit: ['60N', '', '', ''], mixingNo: ['66666', '', '', ''], date: 'today', dateColumn: 1, color: 'yellow', pouringStatus: 'incomplete', formworkNo: 'No.6', floor: '3F' },
                { id: '3IX1Y7', status: '打設前検査完了', value: [5.9, null, null, null], unit: ['60N', '', '', ''], mixingNo: ['66666', '', '', ''], date: 'tomorrow', dateColumn: 2, color: 'orange', pouringStatus: 'incomplete', formworkNo: 'No.6', floor: '3F' },
                { id: '3IX1Y8', status: '打設完了', value: [5.4, null, null, null], unit: ['60N', '', '', ''], mixingNo: ['66666', '', '', ''], date: 'today', dateColumn: 1, color: 'pink', pouringStatus: 'completed', formworkNo: 'No.8', floor: '3F',orderTimes: { '60N': '14:55' }},
                { id: '3IX1Y9', status: '配筋検査完了', value: [5.7, null, null, null], unit: ['60N', '', '', ''], mixingNo: ['66666', '', '', ''], date: 'tomorrow', dateColumn: 2, color: 'light-yellow', pouringStatus: 'incomplete', formworkNo: 'No.9', floor: '3F',orderTimes: { '60N': '14:55' }},
                { id: '3IX1Y10', status: '配筋検査完了', value: [5.0, null, null, null], unit: ['60N', '', '', ''], mixingNo: ['66666', '', '', ''], date: 'today', dateColumn: 1, color: 'light-yellow', pouringStatus: 'incomplete', formworkNo: 'No.10', floor: '3F' }
            ]
        }
    }
};

