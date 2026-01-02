import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import * as pdfMake from 'pdfmake/build/pdfmake';
import 'pdfmake/build/vfs_fonts';

interface Item {
  id: number;
  name: string;
  qty: number;
  resi: string;
  selected: boolean;
}

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent {
  selectAll = false;

  items: Item[] = [
    { id: 1, name: 'Produk A', qty: 10, selected: false, resi: '' },
    { id: 2, name: 'Produk B', qty: 5, selected: false, resi: '' },
    { id: 3, name: 'Produk C', qty: 8, selected: false, resi: '' },
  ];

  toggleSelectAll() {
    this.items.forEach((item) => (item.selected = this.selectAll));
  }

  toggleItem() {
    this.selectAll = this.items.every((item) => item.selected);
  }

  shipments = [
    {
      selected: false,
      resi: 'SPXID123456789',
      courier: 'Shopee Xpress',
      codeCourier: 'SPX',
      sender: {
        name: 'Toko Maju Jaya',
        address: 'Jakarta Selatan',
      },
      receiver: {
        name: 'Budi Santoso',
        phone: '081234567890',
        address: 'Jl. Kebon Jeruk No. 12, Jakarta Barat',
        type: 'Rumah',
      },
      items: [
        { name: 'Kaos Polos Hitam', qty: 2 },
        { name: 'Celana Jeans', qty: 1 },
      ],
      cod: true,
      totalPrice: '250.000',
      totalWeight: '0.20 Kg',
    },
    {
      selected: false,
      resi: 'JNEID987654321',
      courier: 'JNE REG',
      codeCourier: 'JNE',
      sender: {
        name: 'Toko Sukses Abadi',
        address: 'Bandung',
      },
      receiver: {
        name: 'Siti Aminah',
        phone: '081298765432',
        address: 'Jl. Asia Afrika No. 9, Bandung',
        type: 'Rumah',
      },
      items: [
        { name: 'Sepatu Sneakers', qty: 1 },
        { name: 'Kaos Kaki', qty: 3 },
      ],
      cod: false,
      totalPrice: '120.000',
      totalWeight: '4 Kg',
    },
    {
      selected: false,
      resi: 'LZDID312312311',
      courier: 'Lazada',
      codeCourier: 'LEX',
      sender: {
        name: 'Toko Abadi Jaya',
        address: 'Jakarta',
      },
      receiver: {
        name: 'Budi Santoso',
        phone: '082244556677',
        address: 'Jl. Pancoran No 10, Jakarta',
        type: 'Kantor',
      },
      items: [{ name: 'Skincare', qty: 10 }],
      cod: false,
      totalPrice: '10.000',
      totalWeight: '1 Kg',
    },
  ];

  selectAllPoduct = false;

  toggleShipment() {
    // kalau perlu efek ke item, bisa di sini
    this.shipments.filter((s) => s.selected);
  }

  toggleSelectAllProduct() {
    this.shipments.forEach((s) => (s.selected = this.selectAllPoduct));
  }

  toggleItemProduct() {
    this.selectAll = this.shipments.every((s) => s.selected);
  }
  async generateSelectedLabels() {
    const selected = this.shipments.filter((s) => s.selected);

    if (selected.length === 0) {
      alert('Pilih minimal 1 pengiriman');
      return;
    }

    const allContents = await Promise.all(
      selected.map(async (shipment, index) => {
        const label = await this.generateLabel(shipment);
        if (index > 0) {
          label.content.unshift({ text: '', pageBreak: 'after' } as any);
        }
        return label.content;
      })
    );

    const content = allContents.flat();

    (pdfMake as any)
      .createPdf({
        pageSize: {
          width: 288,
          height: 800,
        },
        pageMargins: [10, 10, 10, 10],
        content,
      })
      .open();
  }

  generateShippingLabel(shipment: any) {
    const itemTableBody = [
      [
        { text: 'Nama Barang', bold: true, fontSize: 8 },
        { text: 'Qty', bold: true, fontSize: 8, alignment: 'center' },
      ],
      ...shipment.items.map((item: any) => [
        { text: item.name, fontSize: 8 },
        { text: item.qty.toString(), fontSize: 8, alignment: 'center' },
      ]),
    ];

    return {
      pageSize: { width: 288, height: 'auto' },
      pageMargins: [10, 10, 10, 10],
      content: [
        {
          columns: [
            { text: 'FLEXOFAST', bold: true, fontSize: 10 },
            {
              text: 'Batch 1 NTTS',
              alignment: 'right',
              fontSize: 9,
              bold: true,
            },
          ],
        },

        {
          canvas: [{ type: 'line', x1: 0, y1: 0, x2: 270, y2: 0 }],
          margin: [0, 3, 0, 3],
        },

        {
          margin: [0, 5, 0, 10],
          table: {
            widths: [55, 55, 53, 70],
            body: [
              [
                {
                  text: 'Dikirimkan ke\nLEX',
                  fontSize: 8,
                  bold: true,
                  alignment: 'center',
                },
                {
                  text: 'Diantar oleh\nLEX',
                  fontSize: 8,
                  bold: true,
                  alignment: 'center',
                },
                {
                  stack: [
                    {
                      text: 'STANDARD',
                      fontSize: 9,
                      bold: true,
                      alignment: 'center',
                    },
                    {
                      text: '03 May 2025',
                      fontSize: 7,
                      alignment: 'center',
                      margin: [0, 2, 0, 0],
                    },
                  ],
                },
                {
                  text: 'LAZADA',
                  fontSize: 8,
                  bold: true,
                  alignment: 'center',
                },
              ],
            ],
          },
          layout: {
            hLineWidth: () => 1,
            vLineWidth: () => 1,
          },
        },

        {
          canvas: [
            {
              type: 'line',
              x1: 0,
              y1: 0,
              x2: 272,
              y2: 0,
              lineWidth: 1,
            },
          ],
          margin: [0, 4, 0, 4],
        },
        {
          qr: shipment.resi,
          fit: 80,
          alignment: 'center',
          marginBottom: 6,
        },

        {
          text: shipment.resi,
          alignment: 'center',
          bold: true,
          margin: [0, 6, 0, 4],
        },

        {
          table: {
            widths: [140, '*'],
            body: [
              [
                {
                  stack: [
                    // BARCODE
                    {
                      canvas: [
                        ...Array.from({ length: 28 }).map((_, i) => ({
                          type: 'rect',
                          x: i * 5,
                          y: 0,
                          w: i % 2 === 0 ? 3 : 1,
                          h: 50,
                        })),
                      ],
                      margin: [0, 0, 0, 6],
                    },

                    // TEXT BAWAH BARCODE
                    {
                      text: '3A-WTL-F1',
                      fontSize: 12,
                      bold: true,
                      alignment: 'center',
                    },
                  ],
                  margin: [4, 4, 4, 4],
                },

                {
                  table: {
                    widths: ['*'],
                    body: [
                      [{ text: '3A-WTL-F1', fontSize: 7, alignment: 'center' }],
                      [{ text: 'STANDARD', fontSize: 7, alignment: 'center' }],
                      [
                        {
                          text: shipment.cod ? 'COD' : 'Non-COD',
                          fontSize: 7,
                          alignment: 'center',
                        },
                      ],
                      [{ text: 'Rp. 0.00', fontSize: 7, alignment: 'center' }],
                      [{ text: '0.2 Kg', fontSize: 7, alignment: 'center' }],
                      [
                        {
                          text: 'Total Qty : 1',
                          fontSize: 7,
                          alignment: 'center',
                        },
                      ],
                    ],
                  },
                  layout: {
                    hLineWidth: () => 1,
                    vLineWidth: () => 0,
                  },
                  margin: [0, 0, 0, 0],
                },
              ],
            ],
          },
          layout: {
            hLineWidth: () => 0.5,
            vLineWidth: () => 0.5,
          },
          margin: [0, 5, 0, 5],
        },

        {
          text: '3A-WTL-F1',
          bold: true,
          fontSize: 14,
          alignment: 'center',
          marginBottom: 6,
        },
        {
          table: {
            widths: ['*', '*'],
            body: [
              ['Service', 'STANDARD'],
              ['Pembayaran', shipment.cod ? 'COD' : 'Non-COD'],
              ['Berat', '0.2 Kg'],
              ['Total Qty', shipment.items.length.toString()],
            ],
          },
          fontSize: 8,
          layout: 'lightHorizontalLines',
          marginBottom: 6,
        },

        { text: 'Pengirim:', bold: true, fontSize: 8 },
        {
          text: shipment.sender.name + '\n' + shipment.sender.address,
          fontSize: 8,
          marginBottom: 4,
        },

        { text: 'Penerima:', bold: true, fontSize: 8 },
        {
          text:
            shipment.receiver.name +
            '\n' +
            shipment.receiver.phone +
            '\n' +
            shipment.receiver.address,
          fontSize: 8,
          marginBottom: 4,
        },

        {
          table: {
            widths: ['*', 30],
            body: [
              [
                { text: 'Nama Produk', bold: true, fontSize: 7 },
                { text: 'Qty', bold: true, fontSize: 7 },
              ],
              ...shipment.items.map((item: any) => [
                { text: item.name, fontSize: 7 },
                { text: item.qty.toString(), fontSize: 7, alignment: 'center' },
              ]),
            ],
          },
          layout: 'lightHorizontalLines',
          marginBottom: 6,
        },

        {
          columns: [
            {
              qr: shipment.resi,
              fit: 70,
            },
            {
              text: 'WAJIB VIDEO\nUNBOXING !!!',
              bold: true,
              alignment: 'center',
              fontSize: 9,
            },
          ],
        },
      ],
    };
  }

  lazadaImage!: string;
  spxImage!: string;
  jneImage!: string;

  courierLogos: Record<string, string> = {};
  async ngOnInit() {
    this.lazadaImage = await this.getBase64FromUrl('/assets/lazada.png');
    this.spxImage = await this.getBase64FromUrl('/assets/logo-spx.png');
    this.jneImage = await this.getBase64FromUrl('/assets/logo-jne.jpg');

    this.courierLogos = {
      lazada: this.lazadaImage,
      'shopee xpress': this.spxImage,
      'jne reg': this.jneImage,
    };
  }
  async generateLabel(shipments: any) {
    const logoBase64 = await this.getBase64FromUrl(
      '/assets/logo-flexofast.jpg'
    );
    const barcode = await this.getBase64FromUrl('/assets/barcode.jpg');
    const barcode2 = await this.getBase64FromUrl('/assets/barcode-2.jpg');

    return {
      pageSize: { width: 288, height: 800 },
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
                      image: logoBase64,
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

              // 2
              [
                {
                  stack: [
                    { text: 'Dikirimkan ke', fontSize: 6, alignment: 'center' },
                    {
                      text: shipments.codeCourier,
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
                    { text: 'Diantar oleh', fontSize: 6, alignment: 'center' },
                    {
                      text: shipments.codeCourier,
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
                {
                  image: this.getCourierLogo(shipments?.courier),
                  width: 50,
                  alignment: 'center',
                  margin: [0, 8, 0, 3],
                },
              ],

              //3
              [
                {
                  colSpan: 4,
                  columns: [
                    {
                      image: barcode,
                      width: 255,
                      height: 50,
                      alignment: 'center',
                      margin: [0, 0, 0, 0],
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
                            {
                              image: barcode2,
                              width: 150,
                              height: 60,
                              alignment: 'center',
                              margin: [0, 0, 0, 6],
                            },

                            {
                              text: `${shipments?.resi}`,
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
                                  text: `${shipments?.resi}`,
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
                                  text: shipments?.cod ? 'COD' : 'Non-COD',
                                  fontSize: 7,
                                  alignment: 'center',
                                },
                              ],
                              [
                                {
                                  text: `Rp. ${shipments?.totalPrice}`,
                                  fontSize: 7,
                                  alignment: 'center',
                                },
                              ],
                              [
                                {
                                  text: `${shipments?.totalWeight}`,
                                  fontSize: 7,
                                  alignment: 'center',
                                },
                              ],
                              [
                                {
                                  text: `Total Qty : ${shipments?.items.reduce(
                                    (total: any, item: any) => total + item.qty,
                                    0
                                  )}`,
                                  fontSize: 7,
                                  alignment: 'center',
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
                      text: `Pengirim ${shipments?.sender?.name}`,
                      fontSize: 6,
                      alignment: 'center',
                    },
                    {
                      text: `${shipments?.sender?.address}`,
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
                      text: `Penerima ${shipments?.receiver?.name}`,
                      fontSize: 6,
                      alignment: 'center',
                    },
                    {
                      text: `${shipments?.receiver?.address}`,
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
                      text: `${shipments?.receiver?.type}`,
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
                    {
                      image: barcode2,
                      width: 250,
                      height: 20,
                      alignment: 'center',
                      margin: [0, 0, 0, 0],
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
                      ...shipments.items.map((item: any) => [
                        { text: item.name, fontSize: 7 },
                        {
                          text: item.qty.toString(),
                          fontSize: 7,
                          // alignment: 'center',
                        },
                      ]),
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
                      qr: shipments.resi,
                      fit: 70,
                    },
                    {
                      text: 'WAJIB VIDEO\nUNBOXING !!!',
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

        ///
        {
          table: {
            widths: [24, 24, 24, 24, 24, 24, 24, 24],
            body: [
              [
                {
                  colSpan: 4,
                  image: logoBase64,
                  width: 80,
                  alignment: 'center',
                  margin: [20, 0, 0, 0],
                },
                {},
                {},
                {},
                {
                  colSpan: 4,
                  text: 'PACKING LIST',
                  bold: true,
                  fontSize: 16,
                  alignment: 'center',
                },
                {},
                {},
                {},
              ],

              [
                { colSpan: 2, text: 'CombiPickCode', bold: true, fontSize: 7 },
                {},
                { colSpan: 2, text: 'LXCO-12', bold: true, fontSize: 7 },
                {},
                {
                  colSpan: 4,
                  rowSpan: 3,
                  qr: shipments.resi,
                  fit: 70,
                  bold: true,
                  fontSize: 8,
                },
                {},
                {},
                {},
              ],
              [
                { colSpan: 2, text: 'Order Qty: ', bold: true, fontSize: 7 },
                {},
                { colSpan: 2, text: '2', bold: true, fontSize: 7 },
                {},
                {},
                {},
                {},
                {},
              ],
              [
                {
                  colSpan: 2,
                  text: 'Nilai Tagihan: ',
                  bold: true,
                  fontSize: 7,
                },
                {},
                { colSpan: 2, text: '-', bold: true, fontSize: 7 },
                {},
                {},
                {},
                {},
                {},
              ],
              [
                {
                  colSpan: 8,
                  stack: [
                    {
                      image: barcode2,
                      width: 150,
                      height: 60,
                      alignment: 'center',
                      margin: [0, 10, 0, 0],
                    },
                    {
                      text: `${shipments?.resi}`,
                      fontSize: 12,
                      bold: true,
                      alignment: 'center',
                    },
                  ],
                },
                {},
                {},
                {},
                {},
                {},
                {},
                {},
              ],

              [
                {
                  colSpan: 8,
                  table: {
                    widths: ['*', '*', '*', '*', '*'],
                    body: [
                      [
                        { text: 'Kode Item', bold: true, fontSize: 7 },
                        { text: 'Area', bold: true, fontSize: 7 },
                        { text: 'Deskripsi', bold: true, fontSize: 7 },
                        { text: 'Type', bold: true, fontSize: 7 },
                        { text: 'Qty', bold: true, fontSize: 7 },
                      ],

                      [
                        { text: 'LXC-00008-6', fontSize: 7 },
                        {
                          text: 'LC-157',
                          fontSize: 7,
                        },
                        {
                          text: 'Luxcrime Mini Blur',
                          fontSize: 7,
                        },
                        {
                          text: '-',
                          fontSize: 7,
                        },
                        {
                          text: '5',
                          fontSize: 7,
                        },
                      ],
                    ],
                  },
                  // layout: 'lightHorizontalLines',
                },
                {},
                {},
                {},
                {},
                {},
                {},
                {},
              ],
              [
                {
                  colSpan: 8,
                  text: `Total Kirim: 12`,
                  fontSize: 8,
                  bold: true,
                  alignment: 'right',
                },
                {},
                {},
                {},
                {},
                {},
                {},
                {},
              ],
            ],
          },
          margin: [0, 50, 0, 0],
        },
      ],
    };
  }

  getBase64FromUrl(url: string): Promise<string> {
    return fetch(url)
      .then((res) => res.blob())
      .then(
        (blob) =>
          new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
          })
      );
  }

  getCourierClass(courier: string): string {
    switch (courier?.toLowerCase()) {
      case 'lazada':
        return 'badge-lazada';
      case 'lex':
        return 'badge-lex';
      case 'jne reg':
        return 'badge-jne';
      case 'jnt':
        return 'badge-jnt';
      case 'sicepat':
        return 'badge-sicepat';
      case 'shopee xpress':
        return 'badge-shopee';
      default:
        return 'badge-default';
    }
  }

  getCourierLogo(courier: string): string | null {
    if (!courier) return null;

    return this.courierLogos[courier.toLowerCase()] ?? null;
  }
}
