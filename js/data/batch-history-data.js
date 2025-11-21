// ========================================
// ユーティリティ関数
// ========================================

// 数値をフォーマットする関数（基本的には小数点第2位まで、それを超える場合はそのまま）
function formatVolume(value) {
    const num = parseFloat(value);
    if (isNaN(num)) return value;
    
    // 小数点第2位で丸めた値
    const rounded = Math.round(num * 100) / 100;
    
    // 丸めた値と元の値の差が非常に小さい場合（0.0001未満）は、小数点第2位までで表示
    if (Math.abs(num - rounded) < 0.0001) {
        return rounded.toFixed(2);
    } else {
        // 小数点第2位を超える場合は、そのまま表示
        // ただし、不要な末尾の0は削除
        return num.toString().replace(/\.?0+$/, '');
    }
}

// mixからmixNoを生成する関数（mixの最初の数字を5桁で表示）
function generateMixNo(mix) {
    // mixから最初の数字を抽出（例："36N" → "3"）
    const match = mix.match(/^\d/);
    if (match) {
        const firstDigit = match[0];
        // その数字を5桁で表示（例："3" → "33333"）
        return firstDigit.repeat(5);
    }
    return "00000"; // 数字が見つからない場合のデフォルト
}

// 日時文字列に分を加算する関数
function addMinutesToDateTime(dateTimeStr, minutes) {
    const [datePart, timePart] = dateTimeStr.split(' ');
    const [year, month, day] = datePart.split('/');
    const [hour, minute, second] = timePart.split(':');
    
    const date = new Date(year, month - 1, day, parseInt(hour), parseInt(minute), parseInt(second));
    date.setMinutes(date.getMinutes() + minutes);
    
    const newYear = date.getFullYear();
    const newMonth = String(date.getMonth() + 1).padStart(2, '0');
    const newDay = String(date.getDate()).padStart(2, '0');
    const newHour = String(date.getHours()).padStart(2, '0');
    const newMinute = String(date.getMinutes()).padStart(2, '0');
    const newSecond = String(date.getSeconds()).padStart(2, '0');
    
    return `${newYear}/${newMonth}/${newDay} ${newHour}:${newMinute}:${newSecond}`;
}

// totalVolumeから複数のバッチ行を生成する関数
function generateBatchRows(baseRecord) {
    const rows = [];
    const totalVolume = parseFloat(baseRecord.totalVolume);
    const batchSize = 1.3; // 1バッチあたりのコンクリート量
    
    if (isNaN(totalVolume) || totalVolume <= 0) {
        // totalVolumeが無効な場合は、元のレコードをそのまま返す
        return [baseRecord];
    }
    
    // totalVolumeをbatchSizeで割って、何回分のバッチができるか計算
    const fullBatches = Math.floor(totalVolume / batchSize);
    const remainder = totalVolume - (fullBatches * batchSize);
    
    let currentDateTime = baseRecord.completionDateTime;
    let batchNo = 1;
    
    // 1.3のバッチを生成
    for (let i = 0; i < fullBatches; i++) {
        const row = {
            ...baseRecord,
            batchNo: String(batchNo),
            totalVolume: formatVolume(totalVolume), // totalVolumeは元の値を表示
            concreteVolume: formatVolume(batchSize),
            mixNo: generateMixNo(baseRecord.mix),
            completionDateTime: currentDateTime
        };
        rows.push(row);
        batchNo++;
        // 次のcompletionDateTimeは17分後
        currentDateTime = addMinutesToDateTime(currentDateTime, 17);
    }
    
    // 端数がある場合は、最後の行として追加
    if (remainder > 0.001) { // 0.001未満の端数は無視
        const row = {
            ...baseRecord,
            batchNo: String(batchNo),
            totalVolume: formatVolume(totalVolume),
            concreteVolume: formatVolume(remainder),
            mixNo: generateMixNo(baseRecord.mix),
            completionDateTime: currentDateTime
        };
        rows.push(row);
    }
    
    return rows;
}

// 10〜3.5の範囲でランダムなtotalVolumeを生成する関数
function generateRandomTotalVolume() {
    const min = 3.5;
    const max = 10.0;
    // 小数点第2位までランダムに生成
    const random = Math.random() * (max - min) + min;
    return Math.round(random * 100) / 100;
}

// ========================================
// データ定義
// ========================================

// 栃木工場のバッチ履歴データ（元データ）
const batchHistoryDataTochigiRaw = [
    {
        batchNo: "1",
        line: "栃木_建築A北",
        projectName: "○○駅西口再開発",
        floor: "18F",
        productNo: "18B-10",
        formworkNo: "01",
        mix: "36N",
        totalVolume: "1.348",
        concreteVolume: "1.000",
        mixNo: "1111",
        orderDateTime: "2025/10/01 08:00:00",
        completionDateTime: "2025/10/01 08:17:00",
        mixer: "1"
    },
    {
        batchNo: "1",
        line: "栃木_建築B北",
        projectName: "○○ビル新築工事",
        floor: "20F",
        productNo: "20C-Xa1Ya1",
        formworkNo: "02",
        mix: "12N",
        totalVolume: "1.541",
        concreteVolume: "1.000",
        mixNo: "1111",
        orderDateTime: "2025/10/02 09:15:00",
        completionDateTime: "2025/10/02 09:32:00",
        mixer: "1"
    },
    {
        batchNo: "2",
        line: "栃木_建築A北",
        projectName: "○○プロジェクト",
        floor: "10F",
        productNo: "10B-10",
        formworkNo: "03",
        mix: "30N",
        totalVolume: "0.310",
        concreteVolume: "0.310",
        mixNo: "1111",
        orderDateTime: "2025/10/03 10:30:00",
        completionDateTime: "2025/10/03 10:47:00",
        mixer: "1"
    },
    {
        batchNo: "1",
        line: "栃木_建築B北",
        projectName: "○○駅西口再開発",
        floor: "15F",
        productNo: "15A-5",
        formworkNo: "04",
        mix: "42N",
        totalVolume: "0.920",
        concreteVolume: "0.920",
        mixNo: "1111",
        orderDateTime: "2025/10/04 11:45:00",
        completionDateTime: "2025/10/04 12:02:00",
        mixer: "1"
    },
    {
        batchNo: "1",
        line: "栃木_建築A北",
        projectName: "○○ビル新築工事",
        floor: "25F",
        productNo: "25D-8",
        formworkNo: "05",
        mix: "24N",
        totalVolume: "2.100",
        concreteVolume: "1.000",
        mixNo: "1111",
        orderDateTime: "2025/10/05 13:00:00",
        completionDateTime: "2025/10/05 13:17:00",
        mixer: "1"
    },
    {
        batchNo: "1",
        line: "栃木_南工場",
        projectName: "○○プロジェクト",
        floor: "12F",
        productNo: "12C-3",
        formworkNo: "06",
        mix: "18N",
        totalVolume: "0.750",
        concreteVolume: "0.750",
        mixNo: "1111",
        orderDateTime: "2025/10/06 14:20:00",
        completionDateTime: "2025/10/06 14:37:00",
        mixer: "1"
    },
    {
        batchNo: "1",
        line: "栃木_建築A北",
        projectName: "○○駅西口再開発",
        floor: "22F",
        productNo: "22E-12",
        formworkNo: "07",
        mix: "33N",
        totalVolume: "1.650",
        concreteVolume: "1.000",
        mixNo: "1111",
        orderDateTime: "2025/10/07 15:40:00",
        completionDateTime: "2025/10/07 15:57:00",
        mixer: "1"
    },
    {
        batchNo: "1",
        line: "栃木_建築B北",
        projectName: "○○駅西口再開発",
        floor: "19F",
        productNo: "19B-11",
        formworkNo: "08",
        mix: "36N",
        totalVolume: "2.500",
        concreteVolume: "1.000",
        mixNo: "1111",
        orderDateTime: "2025/10/08 08:15:00",
        completionDateTime: "2025/10/08 08:32:00",
        mixer: "1"
    },
    {
        batchNo: "1",
        line: "栃木_建築A北",
        projectName: "○○ビル新築工事",
        floor: "21F",
        productNo: "21C-9",
        formworkNo: "09",
        mix: "30N",
        totalVolume: "1.800",
        concreteVolume: "1.000",
        mixNo: "1111",
        orderDateTime: "2025/10/10 09:30:00",
        completionDateTime: "2025/10/10 09:47:00",
        mixer: "1"
    },
    {
        batchNo: "1",
        line: "栃木_南工場",
        projectName: "○○プロジェクト",
        floor: "14F",
        productNo: "14D-4",
        formworkNo: "10",
        mix: "24N",
        totalVolume: "3.200",
        concreteVolume: "1.000",
        mixNo: "1111",
        orderDateTime: "2025/10/12 10:45:00",
        completionDateTime: "2025/10/12 11:02:00",
        mixer: "1"
    },
    {
        batchNo: "1",
        line: "栃木_建築A北",
        projectName: "○○駅西口再開発",
        floor: "16F",
        productNo: "16A-6",
        formworkNo: "11",
        mix: "42N",
        totalVolume: "2.900",
        concreteVolume: "1.000",
        mixNo: "1111",
        orderDateTime: "2025/11/01 11:00:00",
        completionDateTime: "2025/11/01 11:17:00",
        mixer: "1"
    },
    {
        batchNo: "1",
        line: "栃木_建築B北",
        projectName: "○○ビル新築工事",
        floor: "23F",
        productNo: "23E-13",
        formworkNo: "12",
        mix: "18N",
        totalVolume: "4.100",
        concreteVolume: "1.000",
        mixNo: "1111",
        orderDateTime: "2025/11/03 12:15:00",
        completionDateTime: "2025/11/03 12:32:00",
        mixer: "1"
    },
    {
        batchNo: "1",
        line: "栃木_建築A北",
        projectName: "○○プロジェクト",
        floor: "17F",
        productNo: "17B-7",
        formworkNo: "13",
        mix: "33N",
        totalVolume: "3.600",
        concreteVolume: "1.000",
        mixNo: "1111",
        orderDateTime: "2025/11/05 13:30:00",
        completionDateTime: "2025/11/05 13:47:00",
        mixer: "1"
    },
    {
        batchNo: "1",
        line: "栃木_南工場",
        projectName: "○○駅西口再開発",
        floor: "24F",
        productNo: "24F-14",
        formworkNo: "14",
        mix: "36N",
        totalVolume: "4.500",
        concreteVolume: "1.000",
        mixNo: "1111",
        orderDateTime: "2025/11/07 14:45:00",
        completionDateTime: "2025/11/07 15:02:00",
        mixer: "1"
    },
    {
        batchNo: "1",
        line: "栃木_建築A北",
        projectName: "○○ビル新築工事",
        floor: "26F",
        productNo: "26G-15",
        formworkNo: "15",
        mix: "30N",
        totalVolume: "3.800",
        concreteVolume: "1.000",
        mixNo: "1111",
        orderDateTime: "2025/11/10 09:00:00",
        completionDateTime: "2025/11/10 09:17:00",
        mixer: "1"
    },
    {
        batchNo: "1",
        line: "栃木_建築B北",
        projectName: "○○駅西口再開発",
        floor: "27F",
        productNo: "27H-16",
        formworkNo: "16",
        mix: "24N",
        totalVolume: "4.200",
        concreteVolume: "1.000",
        mixNo: "1111",
        orderDateTime: "2025/11/12 10:30:00",
        completionDateTime: "2025/11/12 10:47:00",
        mixer: "1"
    },
    {
        batchNo: "1",
        line: "栃木_南工場",
        projectName: "○○プロジェクト",
        floor: "28F",
        productNo: "28I-17",
        formworkNo: "17",
        mix: "42N",
        totalVolume: "3.900",
        concreteVolume: "1.000",
        mixNo: "1111",
        orderDateTime: "2025/11/15 11:15:00",
        completionDateTime: "2025/11/15 11:32:00",
        mixer: "1"
    },
    {
        batchNo: "1",
        line: "栃木_建築A北",
        projectName: "○○ビル新築工事",
        floor: "29F",
        productNo: "29J-18",
        formworkNo: "18",
        mix: "36N",
        totalVolume: "4.300",
        concreteVolume: "1.000",
        mixNo: "1111",
        orderDateTime: "2025/11/17 13:00:00",
        completionDateTime: "2025/11/17 13:17:00",
        mixer: "1"
    },
    {
        batchNo: "1",
        line: "栃木_建築B北",
        projectName: "○○駅西口再開発",
        floor: "30F",
        productNo: "30K-19",
        formworkNo: "19",
        mix: "18N",
        totalVolume: "3.700",
        concreteVolume: "1.000",
        mixNo: "1111",
        orderDateTime: "2025/11/19 14:30:00",
        completionDateTime: "2025/11/19 14:47:00",
        mixer: "1"
    }
];

// 茨城工場のバッチ履歴データ（元データ）
const batchHistoryDataIbarakiRaw = [
    {
        batchNo: "1",
        line: "茨城_Aライン",
        projectName: "○○駅西口再開発",
        floor: "18F",
        productNo: "18B-10",
        formworkNo: "01",
        mix: "36N",
        totalVolume: "1.348",
        concreteVolume: "1.000",
        mixNo: "1111",
        orderDateTime: "2025/10/01 08:30:00",
        completionDateTime: "2025/10/01 08:47:00",
        mixer: "1"
    },
    {
        batchNo: "1",
        line: "茨城_B1ライン",
        projectName: "○○ビル新築工事",
        floor: "20F",
        productNo: "20C-Xa1Ya1",
        formworkNo: "02",
        mix: "12N",
        totalVolume: "1.541",
        concreteVolume: "1.000",
        mixNo: "1111",
        orderDateTime: "2025/10/02 09:45:00",
        completionDateTime: "2025/10/02 10:02:00",
        mixer: "1"
    },
    {
        batchNo: "2",
        line: "茨城_Aライン",
        projectName: "○○プロジェクト",
        floor: "10F",
        productNo: "10B-10",
        formworkNo: "03",
        mix: "30N",
        totalVolume: "0.310",
        concreteVolume: "0.310",
        mixNo: "1111",
        orderDateTime: "2025/10/03 11:00:00",
        completionDateTime: "2025/10/03 11:17:00",
        mixer: "1"
    },
    {
        batchNo: "1",
        line: "茨城_B1ライン",
        projectName: "○○駅西口再開発",
        floor: "15F",
        productNo: "15A-5",
        formworkNo: "04",
        mix: "42N",
        totalVolume: "0.920",
        concreteVolume: "0.920",
        mixNo: "1111",
        orderDateTime: "2025/10/04 12:15:00",
        completionDateTime: "2025/10/04 12:32:00",
        mixer: "1"
    },
    {
        batchNo: "1",
        line: "茨城_C1ライン",
        projectName: "○○ビル新築工事",
        floor: "25F",
        productNo: "25D-8",
        formworkNo: "05",
        mix: "24N",
        totalVolume: "2.100",
        concreteVolume: "1.000",
        mixNo: "1111",
        orderDateTime: "2025/10/05 13:30:00",
        completionDateTime: "2025/10/05 13:47:00",
        mixer: "1"
    },
    {
        batchNo: "1",
        line: "茨城_B2ライン",
        projectName: "○○プロジェクト",
        floor: "12F",
        productNo: "12C-3",
        formworkNo: "06",
        mix: "18N",
        totalVolume: "0.750",
        concreteVolume: "0.750",
        mixNo: "1111",
        orderDateTime: "2025/10/06 14:45:00",
        completionDateTime: "2025/10/06 15:02:00",
        mixer: "1"
    },
    {
        batchNo: "1",
        line: "茨城_Dライン",
        projectName: "○○駅西口再開発",
        floor: "22F",
        productNo: "22E-12",
        formworkNo: "07",
        mix: "33N",
        totalVolume: "1.650",
        concreteVolume: "1.000",
        mixNo: "1111",
        orderDateTime: "2025/10/07 16:00:00",
        completionDateTime: "2025/10/07 16:17:00",
        mixer: "1"
    },
    {
        batchNo: "1",
        line: "茨城_Aライン",
        projectName: "○○ビル新築工事",
        floor: "19F",
        productNo: "19B-11",
        formworkNo: "08",
        mix: "36N",
        totalVolume: "2.500",
        concreteVolume: "1.000",
        mixNo: "1111",
        orderDateTime: "2025/10/09 08:30:00",
        completionDateTime: "2025/10/09 08:47:00",
        mixer: "1"
    },
    {
        batchNo: "1",
        line: "茨城_B1ライン",
        projectName: "○○駅西口再開発",
        floor: "21F",
        productNo: "21C-9",
        formworkNo: "09",
        mix: "30N",
        totalVolume: "1.800",
        concreteVolume: "1.000",
        mixNo: "1111",
        orderDateTime: "2025/10/11 09:45:00",
        completionDateTime: "2025/10/11 10:02:00",
        mixer: "1"
    },
    {
        batchNo: "1",
        line: "茨城_C1ライン",
        projectName: "○○プロジェクト",
        floor: "14F",
        productNo: "14D-4",
        formworkNo: "10",
        mix: "24N",
        totalVolume: "3.200",
        concreteVolume: "1.000",
        mixNo: "1111",
        orderDateTime: "2025/10/13 10:30:00",
        completionDateTime: "2025/10/13 10:47:00",
        mixer: "1"
    },
    {
        batchNo: "1",
        line: "茨城_B2ライン",
        projectName: "○○駅西口再開発",
        floor: "16F",
        productNo: "16A-6",
        formworkNo: "11",
        mix: "42N",
        totalVolume: "2.900",
        concreteVolume: "1.000",
        mixNo: "1111",
        orderDateTime: "2025/10/16 11:15:00",
        completionDateTime: "2025/10/16 11:32:00",
        mixer: "1"
    },
    {
        batchNo: "1",
        line: "茨城_Dライン",
        projectName: "○○ビル新築工事",
        floor: "23F",
        productNo: "23E-13",
        formworkNo: "12",
        mix: "18N",
        totalVolume: "4.100",
        concreteVolume: "1.000",
        mixNo: "1111",
        orderDateTime: "2025/10/31 12:00:00",
        completionDateTime: "2025/10/31 12:17:00",
        mixer: "1"
    },
    {
        batchNo: "1",
        line: "茨城_Aライン",
        projectName: "○○プロジェクト",
        floor: "17F",
        productNo: "17B-7",
        formworkNo: "13",
        mix: "33N",
        totalVolume: "3.600",
        concreteVolume: "1.000",
        mixNo: "1111",
        orderDateTime: "2025/11/02 13:30:00",
        completionDateTime: "2025/11/02 13:47:00",
        mixer: "1"
    },
    {
        batchNo: "1",
        line: "茨城_B1ライン",
        projectName: "○○ビル新築工事",
        floor: "25F",
        productNo: "25E-15",
        formworkNo: "15",
        mix: "30N",
        totalVolume: "3.500",
        concreteVolume: "1.000",
        mixNo: "1111",
        orderDateTime: "2025/11/04 09:15:00",
        completionDateTime: "2025/11/04 09:32:00",
        mixer: "1"
    },
    {
        batchNo: "1",
        line: "茨城_C1ライン",
        projectName: "○○プロジェクト",
        floor: "26F",
        productNo: "26F-16",
        formworkNo: "16",
        mix: "24N",
        totalVolume: "4.000",
        concreteVolume: "1.000",
        mixNo: "1111",
        orderDateTime: "2025/11/06 10:45:00",
        completionDateTime: "2025/11/06 11:02:00",
        mixer: "1"
    },
    {
        batchNo: "1",
        line: "茨城_B2ライン",
        projectName: "○○駅西口再開発",
        floor: "27F",
        productNo: "27G-17",
        formworkNo: "17",
        mix: "42N",
        totalVolume: "3.700",
        concreteVolume: "1.000",
        mixNo: "1111",
        orderDateTime: "2025/11/09 11:30:00",
        completionDateTime: "2025/11/09 11:47:00",
        mixer: "1"
    },
    {
        batchNo: "1",
        line: "茨城_Dライン",
        projectName: "○○ビル新築工事",
        floor: "28F",
        productNo: "28H-18",
        formworkNo: "18",
        mix: "18N",
        totalVolume: "4.400",
        concreteVolume: "1.000",
        mixNo: "1111",
        orderDateTime: "2025/11/11 12:00:00",
        completionDateTime: "2025/11/11 12:17:00",
        mixer: "1"
    },
    {
        batchNo: "1",
        line: "茨城_Aライン",
        projectName: "○○プロジェクト",
        floor: "29F",
        productNo: "29I-19",
        formworkNo: "19",
        mix: "36N",
        totalVolume: "3.900",
        concreteVolume: "1.000",
        mixNo: "1111",
        orderDateTime: "2025/11/13 13:15:00",
        completionDateTime: "2025/11/13 13:32:00",
        mixer: "1"
    },
    {
        batchNo: "1",
        line: "茨城_C1ライン",
        projectName: "○○駅西口再開発",
        floor: "24F",
        productNo: "24F-14",
        formworkNo: "14",
        mix: "36N",
        totalVolume: "4.500",
        concreteVolume: "1.000",
        mixNo: "1111",
        orderDateTime: "2025/11/15 14:00:00",
        completionDateTime: "2025/11/15 14:17:00",
        mixer: "1"
    },
    {
        batchNo: "1",
        line: "茨城_B1ライン",
        projectName: "○○ビル新築工事",
        floor: "30F",
        productNo: "30J-20",
        formworkNo: "20",
        mix: "33N",
        totalVolume: "4.100",
        concreteVolume: "1.000",
        mixNo: "1111",
        orderDateTime: "2025/11/17 15:30:00",
        completionDateTime: "2025/11/17 15:47:00",
        mixer: "1"
    },
    {
        batchNo: "1",
        line: "茨城_Dライン",
        projectName: "○○駅西口再開発",
        floor: "31F",
        productNo: "31K-21",
        formworkNo: "21",
        mix: "30N",
        totalVolume: "3.600",
        concreteVolume: "1.000",
        mixNo: "1111",
        orderDateTime: "2025/11/19 16:00:00",
        completionDateTime: "2025/11/19 16:17:00",
        mixer: "1"
    }
];

// 元データから実際のデータ配列を生成する関数
function generateBatchHistoryData(rawData) {
    const result = [];
    rawData.forEach(baseRecord => {
        // totalVolumeを10〜3.5の範囲でランダムに設定
        const randomTotalVolume = generateRandomTotalVolume();
        const recordWithRandomVolume = {
            ...baseRecord,
            totalVolume: String(randomTotalVolume)
        };
        
        // totalVolumeから複数のバッチ行を生成
        const batchRows = generateBatchRows(recordWithRandomVolume);
        result.push(...batchRows);
    });
    return result;
}

// 栃木工場のバッチ履歴データ（生成済み）
const batchHistoryDataTochigi = generateBatchHistoryData(batchHistoryDataTochigiRaw);

// 茨城工場のバッチ履歴データ（生成済み）
const batchHistoryDataIbaraki = generateBatchHistoryData(batchHistoryDataIbarakiRaw);

// バッチ履歴データを取得する関数（工場選択に応じて適切なデータを返す）
function getBatchHistoryData(factory = null) {
    // factoryが指定されていない場合は、現在選択されている工場を取得
    if (!factory) {
        const factorySelector = document.querySelector('.factory-selector');
        if (factorySelector) {
            factory = factorySelector.value;
        } else {
            // デフォルトは栃木工場
            factory = 'tochigi-factory';
        }
    }
    
    // 工場に応じて適切なデータを返す
    if (factory === 'ibaraki-factory') {
        return batchHistoryDataIbaraki;
    } else {
        return batchHistoryDataTochigi;
    }
}
