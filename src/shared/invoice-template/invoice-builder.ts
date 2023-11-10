"use strict";

import fs, { type WriteStream } from "fs";
import path from "path";
import PDFDocument from "pdfkit";

export type InvoiceBuilderStyleOptions = {
  document: {
    marginLeft: number;
    marginRight: number;
    marginTop: number;
  };

  fonts: {
    normal: {
      name: string;
      range: RegExp;
      path?: string;
    };
    bold: {
      name: string;
      path?: string;
    };
    fallback: {
      name: string;
      path?: string;
      enabled?: boolean;
      range: RegExp;
      transliterate?: boolean;
    };
  };

  header: {
    backgroundColor: string;
    regularColor: string;
    secondaryColor: string;
    height: number;
    image: {
      path: string;
      width: number;
      height: number;
    } | null;
    textPosition: number;
  };

  table: {
    quantity: {
      position: number;
      maxWidth: number;
    };
    total: {
      position: number;
      maxWidth: number;
    };
  };

  text: {
    primaryColor: string;
    secondaryColor: string;
    headingSize: number;
    regularSize: number;
  };
};

export type InvoiceBuilderDataSection = {
  label?: string;
  value?: string | string[] | number;
  id?: string;
  price?: boolean;
  color?: string;
  weight?: "normal" | "bold";
};

export type InvoiceBuilderDataOptions = {
  invoice: {
    name: string;
    currency?: string;
    header: InvoiceBuilderDataSection[];
    customer: InvoiceBuilderDataSection[];
    seller: InvoiceBuilderDataSection[];
    details: {
      header: InvoiceBuilderDataSection[];
      parts: InvoiceBuilderDataSection[][];
      total: InvoiceBuilderDataSection[];
    };
    legal: InvoiceBuilderDataSection[];
  };
};

export type InvoiceBuilderOptions = {
  style: InvoiceBuilderStyleOptions;
  data: InvoiceBuilderDataOptions;
};

type InvoiceBuilderStore = {
  header: {
    image: null | string;
  };
  cursor: {
    x: number;
    y: number;
  };
  customer: {
    height: number;
  };
  seller: {
    height: number;
  };
  fonts: {
    fallback: {
      loaded: boolean;
    };
  };
  document: null | typeof PDFDocument;
};

type SetTextOptions = {
  fontWeight?: "normal" | "bold";
  colorCode?: string;
  fontSize?: string;
  align?: "left" | "center" | "justify" | "right";
  color?: string;
  marginTop?: number;
  maxWidth?: number;
  skipDown?: boolean;
};

/**
 * @name Invoice
 * @function
 * @param {Object} options The options for creating the new invoice:
 */

export class InvoiceBuilder {
  static defaultOptions: InvoiceBuilderOptions = {
    style: {
      document: {
        marginLeft: 30,
        marginRight: 30,
        marginTop: 30,
      },

      fonts: {
        normal: {
          name: "Helvetica",
          range: /[^\u0000-\u00FF]/m,
        },
        bold: {
          name: "Helvetica-Bold",
        },
        fallback: {
          name: "Noto Sans",
          path: path.join(
            __dirname,
            "../../assets/fonts/",
            "NotoSans-Regular.ttf",
          ),
          enabled: true,
          range: /[^\u0000-\u0500]/m,
          transliterate: true,
        },
      },
      header: {
        backgroundColor: "#F8F8FA",
        regularColor: "#000100",
        secondaryColor: "#8F8F8F",
        height: 150,
        image: null,
        textPosition: 330,
      },
      table: {
        quantity: {
          position: 330,
          maxWidth: 140,
        },
        total: {
          position: 490,
          maxWidth: 80,
        },
      },
      text: {
        primaryColor: "#000100",
        secondaryColor: "#8F8F8F",
        headingSize: 15,
        regularSize: 10,
      },
    },

    data: {
      invoice: {
        name: "Invoice for Acme",
        header: [
          {
            label: "Invoice Number",
            value: 1,
          },
        ],
        customer: [
          {
            label: "Bill To",
            value: [],
          },
        ],
        seller: [
          {
            label: "Bill From",
            value: [],
          },
        ],
        details: {
          header: [
            {
              value: "Description",
            },
            {
              value: "Quantity",
            },
            {
              value: "Subtotal",
            },
          ],
          parts: [],
          total: [
            {
              label: "Total",
              value: 0,
            },
          ],
        },
        legal: [],
      },
    },
  };

  options: InvoiceBuilderOptions;
  store: InvoiceBuilderStore;
  document!: typeof PDFDocument;

  constructor(private readonly _options: InvoiceBuilderOptions) {
    this.options = InvoiceBuilder.defaultOptions;

    this.store = {
      header: {
        image: null,
      },
      cursor: {
        x: 0,
        y: 0,
      },
      customer: {
        height: 0,
      },
      seller: {
        height: 0,
      },
      fonts: {
        fallback: {
          loaded: false,
        },
      },
      document: null,
    };
  }

  /**
   * Load custom fonts
   *
   * @private
   * @return void
   */
  loadCustomFonts() {
    // Register custom fonts
    if (this.options.style.fonts.normal.path) {
      this.document.registerFont(
        this.options.style.fonts.normal.name,
        this.options.style.fonts.normal.path,
      );
    }

    if (this.options.style.fonts.bold.path) {
      this.document.registerFont(
        this.options.style.fonts.bold.name,
        this.options.style.fonts.bold.path,
      );
    }
  }

  /**
   * Load fallback font (unicode chars)
   *
   * @private
   * @return void
   */
  getFontOrFallback(type: "normal" | "bold", value: string) {
    const _normalRange = this.options.style.fonts.normal.range;
    const _fallbackRange = this.options.style.fonts.fallback.range;

    if (type !== "normal" && type !== "bold") {
      type = "normal";
    }

    // Return default font
    if (this.options.style.fonts.fallback?.enabled === false) {
      return this.options.style.fonts[type]?.name;
    }

    // Return default font if not special chars are found
    if (!_normalRange.test((value || "").toString())) {
      return this.options.style.fonts[type].name;
    }

    // Return default font if fallback font if range not supported
    if (_fallbackRange.test((value || "").toString())) {
      return this.options.style.fonts[type].name;
    }

    if (this.store.fonts.fallback.loaded === false) {
      this.document.registerFont(
        this.options.style.fonts.fallback.name,
        this.options.style.fonts.fallback.path,
      );
      this.store.fonts.fallback.loaded = true;
    }

    // Return fallback font
    return this.options.style.fonts.fallback.name;
  }

  /**
   * Generates the header
   *
   * @private
   * @return void
   */
  generateHeader() {
    // Background Rectangle
    this.document
      .rect(0, 0, this.document.page.width, this.options.style.header.height)
      .fill(this.options.style.header.backgroundColor);

    // Add an image to the header if any
    if (this.options.style.header.image?.path) {
      this.document.image(
        this.options.style.header.image.path,
        this.options.style.document.marginLeft,
        this.options.style.document.marginTop,
        {
          width: this.options.style.header.image.width,
          height: this.options.style.header.image.height,
        },
      );
    }

    const _fontMargin = 4;

    // Write header details
    this.setCursor("x", this.options.style.header.textPosition);
    this.setCursor("y", this.options.style.document.marginTop);

    this.setText(this.options.data.invoice.name, {
      fontSize: "heading",
      fontWeight: "bold",
      color: this.options.style.header.regularColor,
    });

    this.options.data.invoice.header.forEach((line) => {
      this.setText(`${line.label}:`, {
        fontWeight: "bold",
        color: this.options.style.header.regularColor,
        marginTop: _fontMargin,
      });

      let _values = [];

      if (Array.isArray(line.value)) {
        _values = line.value;
      } else {
        _values = [line.value];
      }

      _values.forEach((value) => {
        if (!value) return;
        this.setText(String(value), {
          colorCode: "secondary",
          color: this.options.style.header.secondaryColor,
          marginTop: _fontMargin,
        });
      });
    });
  }

  /**
   * Generates customer and seller
   *
   * @private
   * @return void
   */
  generateDetails(type: "customer" | "seller") {
    const _maxWidth = 250;
    const _fontMargin = 4;

    this.setCursor("y", this.options.style.header.height + 18);

    // Use a different left position
    if (type === "customer") {
      this.setCursor("x", this.options.style.document.marginLeft);
    } else {
      this.setCursor("x", this.options.style.header.textPosition);
    }

    this.options.data.invoice[type].forEach((line) => {
      this.setText(`${line.label}:`, {
        colorCode: "primary",
        fontWeight: "bold",
        marginTop: 8,
        maxWidth: _maxWidth,
      });

      let _values = [];

      if (Array.isArray(line.value)) {
        _values = line.value;
      } else {
        _values = [line.value];
      }

      _values.forEach((value) => {
        if (!value) return;
        this.setText(String(value), {
          colorCode: "secondary",
          marginTop: _fontMargin,
          maxWidth: _maxWidth,
        });
      });
    });

    this.store[type].height = this.store.cursor.y;
  }

  /**
   * Generates a row
   *
   * @private
   * @param  {string} type
   * @param  {array} columns
   * @return void
   */
  generateTableRow(
    type: "header" | "row",
    columns: InvoiceBuilderDataSection[],
  ) {
    let _fontWeight: "normal" | "bold" = "normal",
      _colorCode = "secondary";

    this.store.cursor.y = this.document.y;

    this.store.cursor.y += 17;

    if (type === "header") {
      _fontWeight = "bold";
      _colorCode = "primary";
    }

    let _start = this.options.style.document.marginLeft;
    let _maxY = this.store.cursor.y;

    // Computes columns by giving an extra space for the last column \
    //   It is used to keep a perfect alignement
    let _maxWidth =
      (this.options.style.header.textPosition -
        _start -
        this.options.style.document.marginRight) /
      (columns.length - 2);

    columns.forEach((column, index) => {
      let _value;

      if (index < columns.length - 2) {
        this.setCursor("x", _start);
      } else {
        if (index == columns.length - 2) {
          _maxWidth = this.options.style.table.quantity.maxWidth;
          this.setCursor("x", this.options.style.table.quantity.position);
        } else {
          _maxWidth = this.options.style.table.total.maxWidth;
          this.setCursor("x", this.options.style.table.total.position);
        }
      }

      _value = column.value;

      if (column.price === true) {
        _value = this.prettyPrice(String(_value));
      }

      this.setText(String(_value ?? ""), {
        colorCode: _colorCode,
        maxWidth: _maxWidth,
        fontWeight: _fontWeight,
        skipDown: true,
      });

      _start += _maxWidth + 10;

      // Increase y position in case of a line return
      if (this.document.y >= _maxY) {
        _maxY = this.document.y;
      }
    });

    // Set y to the max y position
    this.setCursor("y", _maxY);

    if (type === "header") {
      this.generateLine();
    }
  }

  /**
   * Generates a line separator
   *
   * @private
   * @return void
   */
  generateLine() {
    this.store.cursor.y += this.options.style.text.regularSize + 2;

    this.document
      .strokeColor("#F0F0F0")
      .lineWidth(1)
      .moveTo(this.options.style.document.marginRight, this.store.cursor.y)
      .lineTo(
        this.document.page.width - this.options.style.document.marginRight,
        this.store.cursor.y,
      )
      .stroke();
  }

  /**
   * Generates invoice parts
   *
   * @private
   * @return void
   */
  generateParts() {
    const _startY = Math.max(
      this.store.customer.height,
      this.store.seller.height,
    );

    const _fontMargin = 4;
    const _leftMargin = 15;

    this.setCursor("y", _startY);

    this.setText("\n");

    this.generateTableRow("header", this.options.data.invoice.details.header);

    (this.options.data.invoice.details.parts || []).forEach((part) => {
      this.generateTableRow("row", part);
    });

    this.store.cursor.y += 50;

    (this.options.data.invoice.details.total || []).forEach((total) => {
      const _mainRatio = 0.6,
        _secondaryRatio = 0.3;
      const _margin = 30;
      let _value = total.value;

      this.setCursor("x", this.options.style.table.quantity.position);
      if (total.label) {
        this.setText(total.label, {
          colorCode: "primary",
          fontWeight: "bold",
          marginTop: 12,
          maxWidth: this.options.style.table.quantity.maxWidth,
          skipDown: true,
        });
      }

      this.setCursor("x", this.options.style.table.total.position);

      if (total.price === true) {
        _value = this.prettyPrice(String(total.value));
      }

      if (total.label) {
        this.setText(String(_value ?? ""), {
          colorCode: "secondary",
          maxWidth: this.options.style.table.total.maxWidth,
        });
      }
    });
  }

  /**
   * Generates legal terms
   *
   * @private
   * @return void
   */
  generateLegal() {
    this.store.cursor.y += 60;

    (this.options.data.invoice.legal || []).forEach((legal) => {
      this.setCursor("x", this.options.style.document.marginLeft * 2);

      if (legal.label && legal.value) {
        this.setText(String(legal.value), {
          fontWeight: legal.weight,
          colorCode: legal.color ?? "primary",
          align: "center",
          marginTop: 10,
        });
      }
    });
  }

  /**
   * Moves the internal cursor
   *
   * @private
   * @param  {string} axis
   * @param  {number} value
   * @return void
   */
  setCursor(axis: "x" | "y", value: number) {
    this.store.cursor[axis] = value;
  }

  /**
   * Convert numbers to fixed value and adds currency
   *
   * @private
   * @param  {string | number} value
   * @return string
   */
  prettyPrice(value: string | number) {
    if (typeof value === "number") {
      value = value.toFixed(2);
    }

    if (this.options.data.invoice.currency) {
      value = `${value} ${this.options.data.invoice.currency}`;
    }

    return value;
  }

  /**
   * Adds text on the invoice with specified optons
   *
   * @private
   * @param  {string} text
   * @param  {object} options
   * @return void
   */
  setText(text: string, options: SetTextOptions = {}) {
    const _fontWeight = options.fontWeight ?? "normal";
    const _colorCode = options.colorCode ?? "primary";
    const _fontSize = options.fontSize ?? "regular";
    const _textAlign = options.align ?? "left";
    const _color = options.color ?? "";
    const _marginTop = options.marginTop ?? 0;
    const _maxWidth = options.maxWidth;
    let _fontSizeValue = 0;

    this.store.cursor.y += _marginTop;

    if (!_color) {
      if (_colorCode === "primary") {
        this.document.fillColor(this.options.style.text.primaryColor);
      } else {
        this.document.fillColor(this.options.style.text.secondaryColor);
      }
    }

    if (_fontSize === "regular") {
      _fontSizeValue = this.options.style.text.regularSize;
    } else {
      _fontSizeValue = this.options.style.text.headingSize;
    }

    this.document.font(this.getFontOrFallback(_fontWeight, text));

    this.document.fillColor(_color);
    this.document.fontSize(_fontSizeValue);

    this.document.text(
      //   this.valueOrTransliterate(text),
      text,
      this.store.cursor.x,
      this.store.cursor.y,
      {
        align: _textAlign,
        width: _maxWidth,
      },
    );

    const _diff = this.document.y - this.store.cursor.y;

    this.store.cursor.y = this.document.y;

    // Do not move down
    if (options.skipDown === true) {
      if (_diff > 0) {
        this.store.cursor.y -= _diff;
      } else {
        this.store.cursor.y -= 11.5;
      }
    }
  }

  /**
   * Generates a PDF invoide
   *
   * @public
   * @param  {string|object} output
   * @return Promise
   */
  generate(output: string | { path: string; type: string }) {
    let _stream: WriteStream | null = null;

    this.document = new PDFDocument({
      size: "A4",
    });

    this.loadCustomFonts();
    this.generateHeader();
    this.generateDetails("customer");
    this.generateDetails("seller");
    this.generateParts();
    this.generateLegal();

    if (typeof output === "string" || output?.type === "file") {
      const _path = typeof output === "string" ? output : output.path;
      _stream = fs.createWriteStream(_path);

      this.document.pipe(_stream);
      this.document.end();
    } else {
      this.document.end();
      return this.document;
    }

    return new Promise<void>((resolve, reject) => {
      this.document.on("end", () => {
        return resolve();
      });

      this.document.on("error", () => {
        return reject();
      });
    });
  }
}
