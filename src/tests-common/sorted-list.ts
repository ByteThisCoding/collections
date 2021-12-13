import { AvlSortedList } from "../avl-sorted-list/avl-sorted-list";
import { BinarySortedList } from "../binary-sorted-list/binary-sorted-list";
import { iComparable } from "../models/comparable";
import { SortedArray } from "../sorted-array/sorted-array";

export function runSortedListTests(listName: string, listClass: typeof SortedArray | typeof AvlSortedList | typeof BinarySortedList) {
    it("should add numbers to the list and preserve sorting", () => {
        const testItems = [13, 234, 1, 345, -5, 234, 6];
        const testItemsSorted = [...testItems].sort((a, b) => a - b);
        const ar = new listClass<number>(listClass.compareNumbers);
        ar.addMany(testItems);

        expect(ar.length).toBe(testItems.length);
        expect(ar.toArray()).toEqual(testItemsSorted);
    });

    it("should add strings to the list and preserve sorting", () => {
        const testItems = [
            "v`91#|",
            "q+K46'D,Un1Z-#F!bVt`2q",
            "C&c!&FK;",
            "$T_tu6Ch@[Sp'l+r)ZG%?z",
            "#/Fk;y",
            "r7o>B|KL2nbW$]uoO&OS6^y",
            "Va=Xyj",
            ";hq=Fl!CLRNs7#",
            "q4}Jq%Yb%,BsZ2&^!RR4Sv",
            "8:ZZ?Q",
            "ePN'oBN:IRz5]hRGi5v2J7",
            "Y",
            "#fv6<<5.>xwW2E@o",
            "Ay$/@$|![;h0kbN5]J^c)",
            "OnX-SAG[&'|uIv",
            "MTUJS",
            "}GY$;J}",
            "DsbGo)L",
            "H'mUm@fsKv&r.aHW8}<(@v",
            '5Sh0"DEVq=%J`faWnrQ![',
            "YdTgOaI<r",
            "G@g2`w;9",
            "X-P7<Y3s0pgL#R{V",
            "3Jnd",
            "mM/d$$e9]",
            "]Cu!7;U?",
            '2"E|0:w.]x{#E6',
            "lRr(DCEwKsm.#WAh;PM}Ve%",
            "!eMb%ccdv",
            "ZS.",
            "ill",
            "jhid5mt.*70]vvn'F49",
            "Km",
            "jV:nN^_Zndfo6xB>o8",
            '"4}',
            '>|YzlI;Qk/"`@vv8',
            "7AnS7t",
            ';"oVAM',
            '"$,x">`.',
            "igR@Uzz[g46,G]ER^i",
            "{GY8SJaFmt{*",
            "lU}hpt<'e/@ykRU9",
            "*8G#&0BX*A-J3-D$Xy/mka",
            "O8LDMoe/",
            "=YS-${F;ZF/c&Ij",
            "%S]#ELh_'d!ni@=YnLw_|",
            "*uG0Z=7v",
        ];
        const testItemsSorted = [...testItems].sort((a, b) =>
            a.localeCompare(b)
        );
        const ar = new listClass<string>(listClass.compareStrings);
        ar.addMany(testItems);

        expect(ar.length).toBe(testItems.length);
        expect(ar.toArray()).toEqual(testItemsSorted);
    });

    it("should add Dates to the list and preserve sorting", () => {
        const testItems = [
            new Date(0),
            new Date(),
            new Date(45566),
            new Date(798765),
            new Date(12312312),
        ];
        const testItemsSorted = [...testItems].sort((a, b) => +a - +b);
        const ar = new listClass<Date>(listClass.compareDates);
        ar.addMany(testItems);

        expect(ar.length).toBe(testItems.length);
        expect(ar.toArray()).toEqual(testItemsSorted);
    });

    it("should add custom comparable to the list and preserve sorting", () => {
        class TestItem implements iComparable<TestItem> {
            constructor(public readonly value: number) {}

            //nonincreasing sort
            compareTo(item: TestItem): number {
                return item.value - this.value;
            }
        }

        const testItems = [
            new TestItem(12),
            new TestItem(-1),
            new TestItem(1321231245),
            new TestItem(2343242),
        ];
        const testItemsSorted = [...testItems].sort((a, b) => a.compareTo(b));
        const ar = new listClass<TestItem>(
            listClass.compareFromComparable,
            testItems
        );

        expect(ar.length).toBe(testItems.length);

        expect(ar.toArray()).toEqual(testItemsSorted);
    });

    it("should check if string sorted array contains certain string", () => {
        const testItems = [
            "1in",
            "RhdeTvM",
            '7RXyT"T:',
            "$N",
            "O",
            "J9?",
            '/g"!6Jn',
            "YaQJ$$AR5mMB",
            'T}xlh",\v>P{GHP-qjw/eLZ',
            "`'{xV'mu9.AXH-,\"*%1",
            "l:-VLP^2BD5(",
            "[I+Z9-[fC",
            "=V`#p@4",
            "Slp",
            "Cw+!m\r^yo8NhKy",
            "L3>17?g'{mVVByQU7",
            ">B3vXO[/1U",
            "b",
            "oH&<gEr.X>SSF$3h82rq",
            "5U(/;=sC",
            "[[6Z.%0h/(3q$q/(H",
            "5Ml",
            "#<yT$qy+",
            "!Pq",
            "3WzXLY=B@,",
            "uOL$ky",
            "5|y)Kgzp.`.%rEE)}nBw8g8",
            "x!*FIwLGx@T5",
            "PW",
            "@$}E@x+6mo[7V",
            "d=Cxo!9D-70[,g'_>FdV",
            "tDiMJmp4=_:Udq]F<H%oJg",
            "}Xu(2S=",
            "s0h#",
            "th",
            "b$",
            "+",
            "$[l/E@F*]]9E1]/lW",
            "7fw4a+mdO:Y@dwrHyR",
            "q+}*i#(q7z]jOt;{w81hEF",
            "qkG(OV*;?W<kNwfz=3x]Zk5`",
            "i033@eA1Y#l3rvMrrh(eK",
            "2,5^O*=,Y9@z<",
            "YQUT#8]rV",
            "U8B_G>z:2/jw",
            "*61Y0.(*,{M(6A",
            "onPA:S-EVe2#",
            "[WrPMa",
            'w=`%r0kSCx;j1NVB1"R%',
            "$j403c",
            "Be&SiX<.(X/H6#gZ8",
            "oO1Jv",
            "1=.wPTVo2{PbCC",
            "LR:@c?%xK2|;*pXMW",
            "D@x;B'B!Pey",
            "&s'v([!bHEZEur1A[8ib@kMp",
            "w|Gt8kkf4?)",
            "TM'",
            "u",
            "f",
            "|kRMpmk",
            "mrPOEn1",
            "WFi1$CAq%vl",
            "9d0E>AW}&L:d3EA",
            "3897jy?>*pK!aDbCVXmK73A",
            'L$)|Z@]B7&S>ms"ttsI.8',
            "*|Db''bL2,ecB",
            "]",
            "aL20i:z",
            "-_oYDo)0NLh``zolE[?",
            "qtf-}Q+",
            "^",
            "#ZsSCRa&+:Aav}4JX",
            'Uy"Cn)',
            "]F",
            ".t3Eq:QUC/Pf'dTG2Kz>4YJ>",
        ];
        const sortedAr = new listClass(listClass.compareStrings, testItems);

        expect(sortedAr.contains("RhdeTvM")).toBe(true);
        expect(sortedAr.contains("yy")).toBe(false);
        expect(sortedAr.contains("O")).toBe(true);
        expect(sortedAr.contains('T}xlh",\v>P{GHP-qjw/eLZ')).toBe(true);
        expect(sortedAr.contains("")).toBe(false);
    });

    it("should be iterable as for x in y", () => {
        const testItems = [
            "zz",
            "abc",
            "abcdef",
            "asf",
            "asrezs",
            "asghdhfdggfsdg",
        ];
        const sortedAr = new listClass(listClass.compareStrings, testItems);

        let numHit = 0;
        for (let item of sortedAr) {
            numHit++;
            expect(testItems.indexOf(item) > -1);
        }

        expect(numHit).toBe(testItems.length);
    });

    it("should get an item based on ComparableType interface", () => {
        interface iTestItemComparable {
            value: number;
        }

        interface iTestItem extends iTestItemComparable {
            message: string;
        }

        class TestItem implements iTestItem {
            constructor(
                public readonly value: number,
                public readonly message: string
            ) {}
        }

        const testItems = [
            new TestItem(12, "something"),
            new TestItem(-1, "else"),
            new TestItem(123123, "Byte This!"),
        ];

        const sortedAr = new listClass<iTestItemComparable, iTestItem>(
            listClass.compareFromProperty(
                "value",
                listClass.compareNumbers
            ),
            testItems
        );

        expect(
            sortedAr.contains({
                value: 12,
            })
        ).toBe(true);

        expect(
            sortedAr.contains({
                value: 120,
            })
        ).toBe(false);

        expect(
            sortedAr.find({
                value: 12,
            })?.message
        ).toBe("something");
    });

    it("should do some action for each item using forEach", () => {
        const testItems = [
            "zz",
            "abc",
            "abcdef",
            "asf",
            "asrezs",
            "asghdhfdggfsdg",
        ];
        const sortedAr = new listClass(listClass.compareStrings, testItems);

        let numHit = 0;

        sortedAr.forEach((item) => {
            numHit++;
            expect(testItems.indexOf(item) > -1);
        });

        expect(numHit).toBe(testItems.length);
    });

    it("should map list to new list", () => {
        const strAr = ["zz", "yyyyyy", "x"];
        const numAr = strAr.map((str) => str.length).sort((a, b) => a - b);

        const stringSortedList = new listClass<string>(
            listClass.compareStrings,
            strAr
        );
        const mappedSortedList = stringSortedList.map<number>(
            listClass.compareNumbers,
            (str: string) => str.length
        );

        expect(mappedSortedList.toArray()).toStrictEqual(numAr);
    });

    it("should filter list", () => {
        const list = [231, 57498, 12, 2, 456, 7, 65465];
        const expectedFilteredSorted = list
            .filter((item) => item % 2 === 0)
            .sort((a, b) => a - b);

        const sortedList = new listClass(listClass.compareNumbers, list);

        const filteredList = sortedList.filter((item) => item % 2 === 0);
        expect(filteredList.toArray()).toStrictEqual(expectedFilteredSorted);
    });

    it("should get the intersection between two lists", () => {
        const strA = ["abc", "d", "ef"];

        const strB = new listClass<string>(listClass.compareStrings, [
            "abc",
            "d",
            "g",
        ]);

        const intersection = strB.getIntersectionWith(strA);
        expect(intersection.length).toBe(2);

        expect(strB.hasSameElementsAs(strA)).toBe(false);
        expect(strB.hasSameElementsAs(strB)).toBe(true);
    });

    it("should remove an item", () => {
        const strList = new listClass<string>(listClass.compareStrings, [
            "abc",
            "d",
            "g",
        ]);

        strList.remove("abc");

        expect(strList.length).toBe(2);
        expect(strList.toArray()).toEqual(["d", "g"]);
    });
}