export const dataLabel = [
  {
    id: '1',
    name: 'Shopee',
    description: 'SPX',
    layout: {
      pageSize: {
        width: 283,
        height: 425,
      },
      pageMargins: [10, 10, 10, 10],
      content: [
        {
          table: {
            widths: [50, 60, 60, 60],
            body: [
              [
                {
                  colSpan: 4,
                  columns: [
                    {
                      text: '{{logo}}',
                      width: 80,
                      alignment: 'center',
                      margin: [20, 0, 0, 0],
                    },
                    {
                      text: 'Batch 1 NTTS',
                      alignment: 'right',
                      fontSize: 9,
                      bold: true,
                      margin: [0, 6, 0, 0],
                    },
                  ],
                  margin: [0, 0, 0, 0],
                },
                {},
                {},
                {},
              ],
              [
                {
                  stack: [
                    {
                      text: 'Dikirimkan ke',
                      fontSize: 6,
                      alignment: 'center',
                    },
                    {
                      text: '{{LEX}}',
                      fontSize: 14,
                      bold: true,
                      alignment: 'center',
                      margin: [0, 2, 0, 0],
                    },
                  ],
                  margin: [2, 3, 2, 3],
                },
                {
                  stack: [
                    {
                      text: 'Diantar oleh',
                      fontSize: 6,
                      alignment: 'center',
                    },
                    {
                      text: '{{LEX}}',
                      fontSize: 14,
                      bold: true,
                      alignment: 'center',
                      margin: [0, 2, 0, 0],
                    },
                  ],
                  margin: [2, 3, 2, 3],
                },
                {
                  stack: [
                    {
                      text: 'STANDARD',
                      fontSize: 10,
                      bold: true,
                      alignment: 'center',
                    },
                    {
                      text: '03 May 2025',
                      fontSize: 7,
                      alignment: 'center',
                      margin: [0, 3, 0, 0],
                    },
                  ],
                  margin: [2, 3, 2, 3],
                },
                // {
                //   image: '{{this.getCourierLogo(shipments?.courier)}}',
                //   width: 50,
                //   alignment: 'center',
                //   margin: [0, 8, 0, 3],
                // },
                {},
              ],

              [
                {
                  colSpan: 4,
                  columns: [
                    // {
                    //   image: barcode,
                    //   width: 255,
                    //   height: 50,
                    //   alignment: 'center',
                    //   margin: [0, 0, 0, 0],
                    // },
                    {
                      text: 'barcode',
                    },
                  ],
                  margin: [0, 4, 0, 4],
                },
                {},
                {},
                {},
              ],

              [
                {
                  colSpan: 4,
                  table: {
                    widths: [140, '*'],
                    body: [
                      [
                        {
                          stack: [
                            // {
                            //   image: barcode2,
                            //   width: 150,
                            //   height: 60,
                            //   alignment: 'center',
                            //   margin: [0, 0, 0, 6],
                            // },
                            {
                              text: 'barcode',
                            },

                            {
                              text: '`${shipments?.resi}`',
                              fontSize: 12,
                              bold: true,
                              alignment: 'center',
                            },
                          ],
                          margin: [0, 0, 0, 0],
                        },

                        {
                          table: {
                            widths: ['*'],
                            body: [
                              [
                                {
                                  text: '`${shipments?.resi}`',
                                  fontSize: 7,
                                  alignment: 'center',
                                },
                              ],
                              [
                                {
                                  text: 'STANDARD',
                                  fontSize: 7,
                                  alignment: 'center',
                                },
                              ],
                              [
                                {
                                  text: 'shipments?.cod',
                                  fontSize: 7,
                                  alignment: 'center',
                                },
                              ],
                              [
                                {
                                  text: '`Rp. ${shipments?.totalPrice}`',
                                  fontSize: 7,
                                  alignment: 'center',
                                },
                              ],
                              [
                                {
                                  text: '`${shipments?.totalWeight}`',
                                  fontSize: 7,
                                  alignment: 'center',
                                },
                              ],
                              [
                                // {
                                //   text: `Total Qty : ${shipments?.items.reduce(
                                //     (total, item) => total + item.qty,
                                //     0
                                //   )}`,
                                //   fontSize: 7,
                                //   alignment: 'center',
                                // },
                                {
                                  text: 'totalQty',
                                  fontSize: 7,
                                },
                              ],
                            ],
                          },
                          layout: {
                            hLineWidth: () => 1,
                            vLineWidth: () => 1,
                          },
                          margin: [0, 0, 0, 0],
                        },
                      ],
                    ],
                  },
                  layout: {
                    hLineWidth: () => 0,
                    vLineWidth: () => 0,
                  },
                  margin: [0, 0, 0, 0],
                },
                {},
                {},
                {},
              ],

              [
                {
                  colSpan: 2,
                  stack: [
                    {
                      text: '`Pengirim ${shipments?.sender?.name}`',
                      fontSize: 6,
                      alignment: 'center',
                    },
                    {
                      text: '`${shipments?.sender?.address}`',
                      fontSize: 8,
                      bold: true,
                      alignment: 'center',
                      margin: [0, 2, 0, 0],
                    },
                  ],
                  margin: [2, 3, 2, 3],
                },
                {},
                {
                  stack: [
                    {
                      text: '`Penerima ${shipments?.receiver?.name}`',
                      fontSize: 6,
                      alignment: 'center',
                    },
                    {
                      text: '`${shipments?.receiver?.address}`',
                      fontSize: 8,
                      bold: true,
                      alignment: 'center',
                      margin: [0, 2, 0, 0],
                    },
                  ],
                  margin: [2, 3, 2, 3],
                },
                {
                  stack: [
                    {
                      text: '`${shipments?.receiver?.type}`',
                      fontSize: 6,
                      alignment: 'center',
                    },
                    {
                      text: 'K001',
                      fontSize: 8,
                      bold: true,
                      alignment: 'center',
                      margin: [0, 2, 0, 0],
                    },
                  ],
                  margin: [2, 3, 2, 3],
                },
              ],

              [
                {
                  colSpan: 4,
                  columns: [
                    // {
                    //   image: barcode2,
                    //   width: 250,
                    //   height: 20,
                    //   alignment: 'center',
                    //   margin: [0, 0, 0, 0],
                    // },
                    {
                      text: 'barcode',
                    },
                  ],
                  margin: [0, 4, 0, 4],
                },
                {},
                {},
                {},
              ],

              [
                {
                  colSpan: 4,
                  table: {
                    widths: ['*', 30],
                    body: [
                      [
                        { text: 'Nama Produk', bold: true, fontSize: 7 },
                        { text: 'Qty', bold: true, fontSize: 7 },
                      ],
                      [
                        { text: 'item.name', fontSize: 7 },
                        {
                          text: 'item.qty.toString()',
                          fontSize: 7,
                          // alignment: 'center',
                        },
                      ],
                    ],
                  },
                  layout: 'lightHorizontalLines',
                },
                {},
                {},
                {},
              ],

              [
                {
                  colSpan: 4,
                  columns: [
                    {
                      qr: 'shipments.resi',
                      fit: 70,
                    },
                    {
                      text: 'WAJIB VIDEO UNBOXING !!!',
                      bold: true,
                      alignment: 'center',
                      fontSize: 9,
                      margin: [0, 20, 0, 0],
                    },
                  ],
                },
                {},
                {},
                {},
              ],
            ],
          },
        },
      ],
    },
  },
  {
    id: '2',
    name: 'Lazada',
    description: 'LEX',
    layout: {
      pageSize: { width: 283, height: 425 },
      pageMargins: [10, 10, 10, 10],
      content: [
        { text: 'Nama: Daffa Rayhan', margin: [0, 20, 0, 0] },
        { text: 'Resi: AB123456789' },
      ],
    },
  },
];
