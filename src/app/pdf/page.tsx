"use client";
import { FixedIncomeExtractsPdf } from "@/components/pdf/fixed-income-extracts";
import { PDFViewer } from "@react-pdf/renderer";
import React from "react";
const mock = {
  userEmail: "v5@gmail.com",
  operations: [
    {
      incomes: [
        {
          value: 120,
          type: "cdi",
        },
      ],
      id: "66fa1dfaeffadbdba46fca18",
      companyName: "Santander",
      dueDate: "2024-12-23T03:00:00.000Z",
      purchaseDate: "2023-01-02T03:00:00.000Z",
      investedValue: 10000,
      userId: "h75jjbhkgdosctgh",
      latestValue: 12725.361771581636,
      investmentEvolution: [
        {
          date: "2023-01-02T03:00:00.000Z",
          value: 10000,
        },
        {
          date: "2023-01-01T03:00:00.000Z",
          value: 10134.4,
          percentEvolution: 1.343999999999994,
        },
        {
          date: "2023-02-01T03:00:00.000Z",
          value: 10246.283775999998,
          percentEvolution: 2.462837759999985,
        },
        {
          date: "2023-03-01T03:00:00.000Z",
          value: 10390.141600215038,
          percentEvolution: 3.901416002150384,
        },
        {
          date: "2023-04-01T03:00:00.000Z",
          value: 10504.848763481412,
          percentEvolution: 5.048487634814109,
        },
        {
          date: "2023-05-01T03:00:00.000Z",
          value: 10646.0339308626,
          percentEvolution: 6.460339308626018,
        },
        {
          date: "2023-06-01T03:00:00.000Z",
          value: 10782.729006534877,
          percentEvolution: 7.827290065348777,
        },
        {
          date: "2023-07-01T03:00:00.000Z",
          value: 10921.179246978785,
          percentEvolution: 9.211792469787852,
        },
        {
          date: "2023-08-01T03:00:00.000Z",
          value: 11070.580979077455,
          percentEvolution: 10.705809790774552,
        },
        {
          date: "2023-09-01T03:00:00.000Z",
          value: 11199.442541673918,
          percentEvolution: 11.994425416739162,
        },
        {
          date: "2023-10-01T03:00:00.000Z",
          value: 11333.835852174005,
          percentEvolution: 13.338358521740048,
        },
        {
          date: "2023-11-01T03:00:00.000Z",
          value: 11458.961399982005,
          percentEvolution: 14.58961399982006,
        },
        {
          date: "2023-12-01T03:00:00.000Z",
          value: 11581.343107733814,
          percentEvolution: 15.813431077338123,
        },
        {
          date: "2024-01-01T03:00:00.000Z",
          value: 11716.149941507836,
          percentEvolution: 17.161499415078367,
        },
        {
          date: "2024-02-01T03:00:00.000Z",
          value: 11828.624980946312,
          percentEvolution: 18.286249809463115,
        },
        {
          date: "2024-03-01T03:00:00.000Z",
          value: 11946.438085756536,
          percentEvolution: 19.464380857565345,
        },
        {
          date: "2024-04-01T03:00:00.000Z",
          value: 12074.026044512415,
          percentEvolution: 20.74026044512415,
        },
        {
          date: "2024-05-01T03:00:00.000Z",
          value: 12194.283343915758,
          percentEvolution: 21.94283343915758,
        },
        {
          date: "2024-06-01T03:00:00.000Z",
          value: 12309.885150016078,
          percentEvolution: 23.098851500160777,
        },
        {
          date: "2024-07-01T03:00:00.000Z",
          value: 12444.309095854254,
          percentEvolution: 24.44309095854254,
        },
        {
          date: "2024-08-01T03:00:00.000Z",
          value: 12574.227682814973,
          percentEvolution: 25.742276828149727,
        },
        {
          date: "2024-09-01T03:00:00.000Z",
          value: 12700.97589785775,
          percentEvolution: 27.009758978577494,
        },
        {
          date: "2024-10-01T03:00:00.000Z",
          value: 12725.361771581636,
          percentEvolution: 27.25361771581636,
        },
      ],
    },
    {
      incomes: [
        {
          value: 100,
          type: "inflation",
        },
        {
          value: 6.6,
          type: "fixed",
        },
      ],
      id: "66faebc72c15adee5e33d4d4",
      companyName: "Meta",
      dueDate: "2024-12-23T03:00:00.000Z",
      purchaseDate: "2023-01-02T03:00:00.000Z",
      investedValue: 5000,
      userId: "h75jjbhkgdosctgh",
      latestValue: 5581.180580780284,
      investmentEvolution: [
        {
          date: "2023-01-02T03:00:00.000Z",
          value: 5000,
        },
        {
          date: "2023-01-01T03:00:00.000Z",
          value: 5035.706738378234,
          percentEvolution: 0.714134767564687,
        },
        {
          date: "2023-02-01T03:00:00.000Z",
          value: 5087.279161878563,
          percentEvolution: 1.7455832375712674,
        },
        {
          date: "2023-03-01T03:00:00.000Z",
          value: 5132.7662935879935,
          percentEvolution: 2.655325871759871,
        },
        {
          date: "2023-04-01T03:00:00.000Z",
          value: 5173.527375263217,
          percentEvolution: 3.4705475052643493,
        },
        {
          date: "2023-05-01T03:00:00.000Z",
          value: 5194.95275083366,
          percentEvolution: 3.899055016673188,
        },
        {
          date: "2023-06-01T03:00:00.000Z",
          value: 5200.362502805836,
          percentEvolution: 4.0072500561167175,
        },
        {
          date: "2023-07-01T03:00:00.000Z",
          value: 5216.178613216266,
          percentEvolution: 4.323572264325321,
        },
        {
          date: "2023-08-01T03:00:00.000Z",
          value: 5237.780622391869,
          percentEvolution: 4.755612447837379,
        },
        {
          date: "2023-09-01T03:00:00.000Z",
          value: 5261.043427184677,
          percentEvolution: 5.220868543693541,
        },
        {
          date: "2023-10-01T03:00:00.000Z",
          value: 5283.357341496045,
          percentEvolution: 5.667146829920895,
        },
        {
          date: "2023-11-01T03:00:00.000Z",
          value: 5307.87923981261,
          percentEvolution: 6.157584796252195,
        },
        {
          date: "2023-12-01T03:00:00.000Z",
          value: 5347.377014656404,
          percentEvolution: 6.947540293128071,
        },
        {
          date: "2024-01-01T03:00:00.000Z",
          value: 5379.682378354706,
          percentEvolution: 7.5936475670941235,
        },
        {
          date: "2024-02-01T03:00:00.000Z",
          value: 5434.239607738153,
          percentEvolution: 8.684792154763059,
        },
        {
          date: "2024-03-01T03:00:00.000Z",
          value: 5452.9407155811505,
          percentEvolution: 9.05881431162301,
        },
        {
          date: "2024-04-01T03:00:00.000Z",
          value: 5483.702650012435,
          percentEvolution: 9.67405300024869,
        },
        {
          date: "2024-05-01T03:00:00.000Z",
          value: 5519.025085331031,
          percentEvolution: 10.380501706620606,
        },
        {
          date: "2024-06-01T03:00:00.000Z",
          value: 5540.777482022937,
          percentEvolution: 10.815549640458727,
        },
        {
          date: "2024-07-01T03:00:00.000Z",
          value: 5572.034934192424,
          percentEvolution: 11.440698683848481,
        },
        {
          date: "2024-08-01T03:00:00.000Z",
          value: 5581.180580780284,
          percentEvolution: 11.623611615605682,
        },
      ],
    },
    {
      incomes: [
        {
          value: 100,
          type: "inflation",
        },
      ],
      id: "66faf4582c15adee5e33d4d6",
      companyName: "BBSA",
      dueDate: "2024-12-23T03:00:00.000Z",
      purchaseDate: "2023-01-02T03:00:00.000Z",
      investedValue: 5000,
      userId: "h75jjbhkgdosctgh",
      latestValue: 5380.286411083896,
      investmentEvolution: [
        {
          date: "2023-01-02T03:00:00.000Z",
          value: 5000,
        },
        {
          date: "2023-01-01T03:00:00.000Z",
          value: 5026.5,
          percentEvolution: 0.5300000000000011,
        },
        {
          date: "2023-02-01T03:00:00.000Z",
          value: 5068.7226,
          percentEvolution: 1.3744520000000051,
        },
        {
          date: "2023-03-01T03:00:00.000Z",
          value: 5104.710530460001,
          percentEvolution: 2.094210609200019,
        },
        {
          date: "2023-04-01T03:00:00.000Z",
          value: 5135.849264695807,
          percentEvolution: 2.7169852939161387,
        },
        {
          date: "2023-05-01T03:00:00.000Z",
          value: 5147.661718004607,
          percentEvolution: 2.9532343600921394,
        },
        {
          date: "2023-06-01T03:00:00.000Z",
          value: 5143.543588630203,
          percentEvolution: 2.870871772604062,
        },
        {
          date: "2023-07-01T03:00:00.000Z",
          value: 5149.715840936559,
          percentEvolution: 2.9943168187311784,
        },
        {
          date: "2023-08-01T03:00:00.000Z",
          value: 5161.560187370713,
          percentEvolution: 3.2312037474142556,
        },
        {
          date: "2023-09-01T03:00:00.000Z",
          value: 5174.980243857876,
          percentEvolution: 3.499604877157523,
        },
        {
          date: "2023-10-01T03:00:00.000Z",
          value: 5187.400196443135,
          percentEvolution: 3.7480039288627154,
        },
        {
          date: "2023-11-01T03:00:00.000Z",
          value: 5201.924916993175,
          percentEvolution: 4.038498339863509,
        },
        {
          date: "2023-12-01T03:00:00.000Z",
          value: 5231.055696528338,
          percentEvolution: 4.62111393056675,
        },
        {
          date: "2024-01-01T03:00:00.000Z",
          value: 5253.026130453756,
          percentEvolution: 5.060522609075107,
        },
        {
          date: "2024-02-01T03:00:00.000Z",
          value: 5296.626247336522,
          percentEvolution: 5.932524946730439,
        },
        {
          date: "2024-03-01T03:00:00.000Z",
          value: 5305.100849332261,
          percentEvolution: 6.102016986645225,
        },
        {
          date: "2024-04-01T03:00:00.000Z",
          value: 5325.260232559724,
          percentEvolution: 6.505204651194461,
        },
        {
          date: "2024-05-01T03:00:00.000Z",
          value: 5349.756429629498,
          percentEvolution: 6.995128592589964,
        },
        {
          date: "2024-06-01T03:00:00.000Z",
          value: 5360.99091813172,
          percentEvolution: 7.219818362634399,
        },
        {
          date: "2024-07-01T03:00:00.000Z",
          value: 5381.36268362062,
          percentEvolution: 7.627253672412408,
        },
        {
          date: "2024-08-01T03:00:00.000Z",
          value: 5380.286411083896,
          percentEvolution: 7.605728221677921,
        },
      ],
    },
    {
      incomes: [
        {
          value: 120,
          type: "cdi",
        },
      ],
      id: "66fca86fed0a66545ff1b725",
      companyName: "Master",
      dueDate: "2024-12-31T03:00:00.000Z",
      purchaseDate: "2024-06-04T03:00:00.000Z",
      investedValue: 5000,
      userId: "h75jjbhkgdosctgh",
      latestValue: 5217.757129585993,
      investmentEvolution: [
        {
          date: "2024-06-04T03:00:00.000Z",
          value: 5000,
        },
        {
          date: "2024-06-01T03:00:00.000Z",
          value: 5047.4,
          percentEvolution: 0.9479999999999933,
        },
        {
          date: "2024-07-01T03:00:00.000Z",
          value: 5102.517608,
          percentEvolution: 2.0503521600000028,
        },
        {
          date: "2024-08-01T03:00:00.000Z",
          value: 5155.78789182752,
          percentEvolution: 3.115757836550401,
        },
        {
          date: "2024-09-01T03:00:00.000Z",
          value: 5207.758233777142,
          percentEvolution: 4.155164675542835,
        },
        {
          date: "2024-10-01T03:00:00.000Z",
          value: 5217.757129585993,
          percentEvolution: 4.3551425917198685,
        },
      ],
    },
  ],
  extractedData: [
    {
      incomes: [
        {
          value: 120,
          type: "cdi",
        },
      ],
      id: "66fa1dfaeffadbdba46fca18",
      companyName: "Santander",
      dueDate: "2024-12-23T03:00:00.000Z",
      purchaseDate: "2023-01-02T03:00:00.000Z",
      investedValue: 10000,
      userId: "h75jjbhkgdosctgh",
      latestValue: 12725.361771581636,
      investmentEvolution: [
        {
          date: "2023-01-02T03:00:00.000Z",
          value: 10000,
        },
        {
          date: "2023-01-01T03:00:00.000Z",
          value: 10134.4,
          percentEvolution: 1.343999999999994,
        },
        {
          date: "2023-02-01T03:00:00.000Z",
          value: 10246.283775999998,
          percentEvolution: 2.462837759999985,
        },
        {
          date: "2023-03-01T03:00:00.000Z",
          value: 10390.141600215038,
          percentEvolution: 3.901416002150384,
        },
        {
          date: "2023-04-01T03:00:00.000Z",
          value: 10504.848763481412,
          percentEvolution: 5.048487634814109,
        },
        {
          date: "2023-05-01T03:00:00.000Z",
          value: 10646.0339308626,
          percentEvolution: 6.460339308626018,
        },
        {
          date: "2023-06-01T03:00:00.000Z",
          value: 10782.729006534877,
          percentEvolution: 7.827290065348777,
        },
        {
          date: "2023-07-01T03:00:00.000Z",
          value: 10921.179246978785,
          percentEvolution: 9.211792469787852,
        },
        {
          date: "2023-08-01T03:00:00.000Z",
          value: 11070.580979077455,
          percentEvolution: 10.705809790774552,
        },
        {
          date: "2023-09-01T03:00:00.000Z",
          value: 11199.442541673918,
          percentEvolution: 11.994425416739162,
        },
        {
          date: "2023-10-01T03:00:00.000Z",
          value: 11333.835852174005,
          percentEvolution: 13.338358521740048,
        },
        {
          date: "2023-11-01T03:00:00.000Z",
          value: 11458.961399982005,
          percentEvolution: 14.58961399982006,
        },
        {
          date: "2023-12-01T03:00:00.000Z",
          value: 11581.343107733814,
          percentEvolution: 15.813431077338123,
        },
        {
          date: "2024-01-01T03:00:00.000Z",
          value: 11716.149941507836,
          percentEvolution: 17.161499415078367,
        },
        {
          date: "2024-02-01T03:00:00.000Z",
          value: 11828.624980946312,
          percentEvolution: 18.286249809463115,
        },
        {
          date: "2024-03-01T03:00:00.000Z",
          value: 11946.438085756536,
          percentEvolution: 19.464380857565345,
        },
        {
          date: "2024-04-01T03:00:00.000Z",
          value: 12074.026044512415,
          percentEvolution: 20.74026044512415,
        },
        {
          date: "2024-05-01T03:00:00.000Z",
          value: 12194.283343915758,
          percentEvolution: 21.94283343915758,
        },
        {
          date: "2024-06-01T03:00:00.000Z",
          value: 12309.885150016078,
          percentEvolution: 23.098851500160777,
        },
        {
          date: "2024-07-01T03:00:00.000Z",
          value: 12444.309095854254,
          percentEvolution: 24.44309095854254,
        },
        {
          date: "2024-08-01T03:00:00.000Z",
          value: 12574.227682814973,
          percentEvolution: 25.742276828149727,
        },
        {
          date: "2024-09-01T03:00:00.000Z",
          value: 12700.97589785775,
          percentEvolution: 27.009758978577494,
        },
        {
          date: "2024-10-01T03:00:00.000Z",
          value: 12725.361771581636,
          percentEvolution: 27.25361771581636,
        },
      ],
    },
    {
      incomes: [
        {
          value: 100,
          type: "inflation",
        },
        {
          value: 6.6,
          type: "fixed",
        },
      ],
      id: "66faebc72c15adee5e33d4d4",
      companyName: "Meta",
      dueDate: "2024-12-23T03:00:00.000Z",
      purchaseDate: "2023-01-02T03:00:00.000Z",
      investedValue: 5000,
      userId: "h75jjbhkgdosctgh",
      latestValue: 5581.180580780284,
      investmentEvolution: [
        {
          date: "2023-01-02T03:00:00.000Z",
          value: 5000,
        },
        {
          date: "2023-01-01T03:00:00.000Z",
          value: 5035.706738378234,
          percentEvolution: 0.714134767564687,
        },
        {
          date: "2023-02-01T03:00:00.000Z",
          value: 5087.279161878563,
          percentEvolution: 1.7455832375712674,
        },
        {
          date: "2023-03-01T03:00:00.000Z",
          value: 5132.7662935879935,
          percentEvolution: 2.655325871759871,
        },
        {
          date: "2023-04-01T03:00:00.000Z",
          value: 5173.527375263217,
          percentEvolution: 3.4705475052643493,
        },
        {
          date: "2023-05-01T03:00:00.000Z",
          value: 5194.95275083366,
          percentEvolution: 3.899055016673188,
        },
        {
          date: "2023-06-01T03:00:00.000Z",
          value: 5200.362502805836,
          percentEvolution: 4.0072500561167175,
        },
        {
          date: "2023-07-01T03:00:00.000Z",
          value: 5216.178613216266,
          percentEvolution: 4.323572264325321,
        },
        {
          date: "2023-08-01T03:00:00.000Z",
          value: 5237.780622391869,
          percentEvolution: 4.755612447837379,
        },
        {
          date: "2023-09-01T03:00:00.000Z",
          value: 5261.043427184677,
          percentEvolution: 5.220868543693541,
        },
        {
          date: "2023-10-01T03:00:00.000Z",
          value: 5283.357341496045,
          percentEvolution: 5.667146829920895,
        },
        {
          date: "2023-11-01T03:00:00.000Z",
          value: 5307.87923981261,
          percentEvolution: 6.157584796252195,
        },
        {
          date: "2023-12-01T03:00:00.000Z",
          value: 5347.377014656404,
          percentEvolution: 6.947540293128071,
        },
        {
          date: "2024-01-01T03:00:00.000Z",
          value: 5379.682378354706,
          percentEvolution: 7.5936475670941235,
        },
        {
          date: "2024-02-01T03:00:00.000Z",
          value: 5434.239607738153,
          percentEvolution: 8.684792154763059,
        },
        {
          date: "2024-03-01T03:00:00.000Z",
          value: 5452.9407155811505,
          percentEvolution: 9.05881431162301,
        },
        {
          date: "2024-04-01T03:00:00.000Z",
          value: 5483.702650012435,
          percentEvolution: 9.67405300024869,
        },
        {
          date: "2024-05-01T03:00:00.000Z",
          value: 5519.025085331031,
          percentEvolution: 10.380501706620606,
        },
        {
          date: "2024-06-01T03:00:00.000Z",
          value: 5540.777482022937,
          percentEvolution: 10.815549640458727,
        },
        {
          date: "2024-07-01T03:00:00.000Z",
          value: 5572.034934192424,
          percentEvolution: 11.440698683848481,
        },
        {
          date: "2024-08-01T03:00:00.000Z",
          value: 5581.180580780284,
          percentEvolution: 11.623611615605682,
        },
      ],
    },
    {
      incomes: [
        {
          value: 100,
          type: "inflation",
        },
      ],
      id: "66faf4582c15adee5e33d4d6",
      companyName: "BBSA",
      dueDate: "2024-12-23T03:00:00.000Z",
      purchaseDate: "2023-01-02T03:00:00.000Z",
      investedValue: 5000,
      userId: "h75jjbhkgdosctgh",
      latestValue: 5380.286411083896,
      investmentEvolution: [
        {
          date: "2023-01-02T03:00:00.000Z",
          value: 5000,
        },
        {
          date: "2023-01-01T03:00:00.000Z",
          value: 5026.5,
          percentEvolution: 0.5300000000000011,
        },
        {
          date: "2023-02-01T03:00:00.000Z",
          value: 5068.7226,
          percentEvolution: 1.3744520000000051,
        },
        {
          date: "2023-03-01T03:00:00.000Z",
          value: 5104.710530460001,
          percentEvolution: 2.094210609200019,
        },
        {
          date: "2023-04-01T03:00:00.000Z",
          value: 5135.849264695807,
          percentEvolution: 2.7169852939161387,
        },
        {
          date: "2023-05-01T03:00:00.000Z",
          value: 5147.661718004607,
          percentEvolution: 2.9532343600921394,
        },
        {
          date: "2023-06-01T03:00:00.000Z",
          value: 5143.543588630203,
          percentEvolution: 2.870871772604062,
        },
        {
          date: "2023-07-01T03:00:00.000Z",
          value: 5149.715840936559,
          percentEvolution: 2.9943168187311784,
        },
        {
          date: "2023-08-01T03:00:00.000Z",
          value: 5161.560187370713,
          percentEvolution: 3.2312037474142556,
        },
        {
          date: "2023-09-01T03:00:00.000Z",
          value: 5174.980243857876,
          percentEvolution: 3.499604877157523,
        },
        {
          date: "2023-10-01T03:00:00.000Z",
          value: 5187.400196443135,
          percentEvolution: 3.7480039288627154,
        },
        {
          date: "2023-11-01T03:00:00.000Z",
          value: 5201.924916993175,
          percentEvolution: 4.038498339863509,
        },
        {
          date: "2023-12-01T03:00:00.000Z",
          value: 5231.055696528338,
          percentEvolution: 4.62111393056675,
        },
        {
          date: "2024-01-01T03:00:00.000Z",
          value: 5253.026130453756,
          percentEvolution: 5.060522609075107,
        },
        {
          date: "2024-02-01T03:00:00.000Z",
          value: 5296.626247336522,
          percentEvolution: 5.932524946730439,
        },
        {
          date: "2024-03-01T03:00:00.000Z",
          value: 5305.100849332261,
          percentEvolution: 6.102016986645225,
        },
        {
          date: "2024-04-01T03:00:00.000Z",
          value: 5325.260232559724,
          percentEvolution: 6.505204651194461,
        },
        {
          date: "2024-05-01T03:00:00.000Z",
          value: 5349.756429629498,
          percentEvolution: 6.995128592589964,
        },
        {
          date: "2024-06-01T03:00:00.000Z",
          value: 5360.99091813172,
          percentEvolution: 7.219818362634399,
        },
        {
          date: "2024-07-01T03:00:00.000Z",
          value: 5381.36268362062,
          percentEvolution: 7.627253672412408,
        },
        {
          date: "2024-08-01T03:00:00.000Z",
          value: 5380.286411083896,
          percentEvolution: 7.605728221677921,
        },
      ],
    },
  ],
  filters: {
    intervalType: "Mês",
    intervalValue: "2023-01-06T20:22:34.176Z",
    tableDataType: "operations",
  },
};
export default function Pdf() {
  return (
    <PDFViewer className="w-full h-[100vh]">
      <FixedIncomeExtractsPdf {...mock} />
    </PDFViewer>
  );
}
