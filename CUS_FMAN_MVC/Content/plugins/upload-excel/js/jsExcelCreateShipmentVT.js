$(function () {
    $("#upload_excel").on("change", function () {
        sys.Loading();
        var excelFile,
            fileReader = new FileReader();

        $("#result").hide();

        fileReader.onload = function (e) {
            var buffer = new Uint8Array(fileReader.result);

            $.ig.excel.Workbook.load(buffer, function (workbook) {
                var column, row, newRow, cellValue, columnIndex, i,
                    worksheet = workbook.worksheets(0),
                    columnsNumber = 0,
                    gridColumns = [],
                    data = [],
                    worksheetRowsCount;

                // Both the columns and rows in the worksheet are lazily created and because of this most of the time worksheet.columns().count() will return 0
                // So to get the number of columns we read the values in the first row and count. When value is null we stop counting columns:
                while (worksheet.rows(0).getCellValue(columnsNumber)) {
                    columnsNumber++;
                }

                // Iterating through cells in first row and use the cell text as key and header text for the grid columns
                for (columnIndex = 0; columnIndex < columnsNumber; columnIndex++) {
                    column = worksheet.rows(0).getCellText(columnIndex);
                    if (column != "Votes" && column != "SL IMEI" && column != "Số PXK" && column != "Địa chỉ Kerry" && column != "CK" && column != "% Giảm" && column != "Address" && column != "Ngày HĐ" && column != "Phương thức" && column != "Nhân viên phụ trách" && column != "Người in" && column != "Ngày in" && column != "Người sửa cuối" && column != "Giờ hệ thống" && column != "Số PO khách" && column != "Khóa" && column != "Tỉnh thành" &&column != "Mã CH" && column != "Chuyển Kerry" &&column != "Mở phiếu lần cuối" &&column != "Người mở" &&column != "Số vận đơn" &&column != "Đơn vị vận chuyển" &&column != "T.gian giao" &&column != "Lịch sử thay đổi") {
                        gridColumns.push({ headerText: column, key: column });
                    }
                }

                // We start iterating from 1, because we already read the first row to build the gridColumns array above
                // We use each cell value and add it to json array, which will be used as dataSource for the grid
                for (i = 1, worksheetRowsCount = worksheet.rows().count(); i < worksheetRowsCount; i++) {
                    newRow = {};
                    row = worksheet.rows(i);
                    var textError = 0;
                    var number = 0;
                    for (columnIndex = 0; columnIndex < columnsNumber; columnIndex++) {
                        if (row.getCellText(columnIndex) == "") {
                            textError++;
                        }
                        if (textError > 30) {
                            newRow = null;
                        } else {
                            if (columnIndex != 5 && columnIndex != 8 && columnIndex != 11 && columnIndex != 13 && columnIndex != 14 && columnIndex != 15 && columnIndex != 16 && columnIndex != 17 && columnIndex != 18 && columnIndex != 19 && columnIndex != 20 && columnIndex != 21 && columnIndex != 22 && columnIndex != 23 && columnIndex != 24 && columnIndex != 25 && columnIndex != 26 && columnIndex != 28 && columnIndex != 29 && columnIndex != 30 && columnIndex != 31 && columnIndex != 32 && columnIndex != 33 && columnIndex != 34 && columnIndex != 35) {
                                number++;
                                cellValue = row.getCellText(columnIndex);
                            }
                            newRow[gridColumns[number - 1].key] = cellValue;
                        }
                    }
                    if (textError < 30) {
                        if (Object.keys(newRow)[6] == "Số lượng") {
                            newRow["Số lượng"] = newRow["Số lượng"].replace(',', '.');
                        }
                        //if (newRow["Tỉnh thành"].toLowerCase() === "hcm") {
                        //    newRow["Tỉnh thành"] = "Hồ Chí Minh"
                        //}
                        //if (Object.keys(newRow)[11] == "Tỉnh thành") {
                        //    if (newRow["Địa chỉ Kerry"].indexOf(newRow["Tỉnh thành"]) == -1) {
                        //        newRow["Địa chỉ Kerry"] = (newRow["Địa chỉ Kerry"] ? newRow["Địa chỉ Kerry"] + ", ": " " ) + newRow["Tỉnh thành"];
                        //    }
                        //}

                        data.push(newRow);
                    }
                }

                // we can also skip passing the gridColumns use autoGenerateColumns = true, or modify the gridColumns array
                createGrid(data, gridColumns);
                init_ready();
                sys.HideLoading();
            }, function (error) {
                $("#result").text("The excel file is corrupted.");
                $("#result").show(1000);
                sys.HideLoading();
            });
        }

        if (this.files.length > 0) {
            excelFile = this.files[0];
            if (excelFile.type === "application/vnd.ms-excel" || excelFile.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" || (excelFile.type === "" && (excelFile.name.endsWith("xls") || excelFile.name.endsWith("xlsx")))) {
                fileReader.readAsArrayBuffer(excelFile);
            } else {
                $("#result").text("The format of the file you have selected is not supported. Please select a valid Excel file ('.xls, *.xlsx').");
                $("#result").show(1000);
            }
        }

    })
})

function createGrid(data, gridColumns) {
    if ($("#grid-excel").data("igGrid") !== undefined) {
        $("#grid-excel").igGrid("destroy");
    }
    //gridColumns.push({ headerText: "#price", key: "price" });
    gridColumns.push({ headerText: "#system", key: "system" });
    $("#grid-excel").igGrid({
        columns: gridColumns,
        autoGenerateColumns: true,
        dataSource: data,
        width: "100%"
    });
}