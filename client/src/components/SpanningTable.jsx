import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Container from "@mui/material/Container";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import SpanningTableEdit from "./SpanningTableEdit";
import Typography from "@mui/material/Typography";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import ExcelJS from "exceljs";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#c06428",
    color: "white",
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

export default function SpanningTable({
  charges,
  deleteCharge,
  editCharge,
  editQtyCharge,
  chargeType,
  setChargeType,
}) {
  function ccyFormat(num) {
    return `${num?.toFixed(2)}`;
  }

  function totalIPD() {
    return (totalIPD = charges
      .map((charge) => charge.mph_ipd * charge.qty)
      .reduce((sum, i) => sum + i, 0));
  }

  function totalOPD() {
    return (totalOPD = charges
      .map((charge) => charge.mph_opd * charge.qty)
      .reduce((sum, i) => sum + i, 0));
  }

  function totalIPD_INTL() {
    return (totalIPD_INTL = charges
      .map((charge) => charge.mph_ipd_intl * charge.qty)
      .reduce((sum, i) => sum + i, 0));
  }

  function totalOPD_INTL() {
    return (totalOPD_INTL = charges
      .map((charge) => charge.mph_opd_intl * charge.qty)
      .reduce((sum, i) => sum + i, 0));
  }

  function totalQty() {
    return (totalQty = charges.map((charge) => Number(charge.qty))).reduce(
      (sum, i) => sum + i,
      0
    );
  }

  function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  const handleChargeType = () => {
    setChargeType("");
  };

  const exportExcelFile = () => {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("My Sheet");

    sheet.columns = [
      {
        header: "No",
        key: "no",
        width: 3,
      },
      {
        header: "Code",
        key: "code",
        width: 25,
      },
      {
        header: "Name",
        key: "name",
        width: 70,
      },
      {
        header: "IPD",
        key: "mph_ipd",
        width: 15,
      },
      {
        header: "OPD",
        key: "mph_opd",
        width: 15,
      },
      {
        header: "IPD INTL",
        key: "mph_ipd_intl",
        width: 15,
      },
      {
        header: "OPD INTL",
        key: "mph_opd_intl",
        width: 15,
      },
      {
        header: "Qty",
        key: "qty",
        width: 5,
      },
    ];

    const no = sheet.getColumn("no");
    const code = sheet.getColumn("code");
    const name = sheet.getColumn("name");
    const mph_ipd = sheet.getColumn("mph_ipd");
    const mph_opd = sheet.getColumn("mph_opd");
    const mph_ipd_intl = sheet.getColumn("mph_ipd_intl");
    const mph_opd_intl = sheet.getColumn("mph_opd_intl");
    const qty = sheet.getColumn("qty");

    no.alignment = { horizontal: "center" };
    code.alignment = { horizontal: "center" };
    name.alignment = { horizontal: "center" };
    mph_ipd.alignment = { horizontal: "center" };
    mph_opd.alignment = { horizontal: "center" };
    mph_ipd_intl.alignment = { horizontal: "center" };
    mph_opd_intl.alignment = { horizontal: "center" };
    qty.alignment = { horizontal: "center" };

    if (chargeType === "ipd") {
      sheet.spliceColumns(5, 3);
    } else if (chargeType === "opd") {
      sheet.spliceColumns(4, 1);
      sheet.spliceColumns(5, 2);
    } else if (chargeType === "ipd_intl") {
      sheet.spliceColumns(4, 2);
      sheet.spliceColumns(5, 1);
    } else if (chargeType === "opd_intl") {
      sheet.spliceColumns(4, 3);
      sheet.spliceColumns(6, 1);
    }

    const totalIPD = charges
      .map((charge) => charge.mph_ipd * charge.qty)
      .reduce((sum, i) => sum + i, 0);

    const totalOPD = charges
      .map((charge) => charge.mph_opd * charge.qty)
      .reduce((sum, i) => sum + i, 0);

    const totalIPD_INTL = charges
      .map((charge) => charge.mph_ipd_intl * charge.qty)
      .reduce((sum, i) => sum + i, 0);

    const totalOPD_INTL = charges
      .map((charge) => charge.mph_opd_intl * charge.qty)
      .reduce((sum, i) => sum + i, 0);

    const totalQty = charges
      .map((charge) => Number(charge.qty))
      .reduce((sum, i) => sum + i);

    charges.map((charge, index) => {
      sheet.addRow({
        no: index + 1,
        code: charge.item_code,
        name: charge.item_name_e,
        mph_ipd: !chargeType
          ? numberWithCommas(ccyFormat(charge.mph_ipd * charge.qty))
          : chargeType === "ipd"
          ? numberWithCommas(ccyFormat(charge.mph_ipd * charge.qty))
          : numberWithCommas(ccyFormat(0.0)),

        mph_opd: !chargeType
          ? numberWithCommas(ccyFormat(charge.mph_opd * charge.qty))
          : chargeType === "opd"
          ? numberWithCommas(ccyFormat(charge.mph_opd * charge.qty))
          : numberWithCommas(ccyFormat(0.0)),

        mph_ipd_intl: !chargeType
          ? numberWithCommas(ccyFormat(charge.mph_ipd_intl * charge.qty))
          : chargeType === "ipd_intl"
          ? numberWithCommas(ccyFormat(charge.mph_ipd_intl * charge.qty))
          : numberWithCommas(ccyFormat(0.0)),

        mph_opd_intl: !chargeType
          ? numberWithCommas(ccyFormat(charge.mph_opd_intl * charge.qty))
          : chargeType === "opd_intl"
          ? numberWithCommas(ccyFormat(charge.mph_opd_intl * charge.qty))
          : numberWithCommas(ccyFormat(0.0)),

        qty: charge.qty,
      });
    });

    sheet.addRow({
      no: "",
      code: "",
      name: "Total",
      mph_ipd: !chargeType
        ? numberWithCommas(ccyFormat(totalIPD))
        : chargeType === "ipd"
        ? numberWithCommas(ccyFormat(totalIPD))
        : numberWithCommas(ccyFormat(0.0)),

      mph_opd: !chargeType
        ? numberWithCommas(ccyFormat(totalOPD))
        : chargeType === "opd"
        ? numberWithCommas(ccyFormat(totalOPD))
        : numberWithCommas(ccyFormat(0.0)),

      mph_ipd_intl: !chargeType
        ? numberWithCommas(ccyFormat(totalIPD_INTL))
        : chargeType === "ipd_intl"
        ? numberWithCommas(ccyFormat(totalIPD_INTL))
        : numberWithCommas(ccyFormat(0.0)),

      mph_opd_intl: !chargeType
        ? numberWithCommas(ccyFormat(totalOPD_INTL))
        : chargeType === "opd_intl"
        ? numberWithCommas(ccyFormat(totalOPD_INTL))
        : numberWithCommas(ccyFormat(0.0)),

      qty: totalQty,
    });

    workbook.xlsx.writeBuffer().then((data) => {
      const blob = new Blob([data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheet.sheet",
      });

      const url = window.URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = "items.xlsx";
      anchor.click();
      window.URL.revokeObjectURL(url);
    });
  };

  return (
    <Container maxWidth="xl">
      <TableContainer component={Paper} sx={{ marginTop: "20px" }}>
        <Table sx={{ minWidth: 700 }} aria-label="spanning table">
          <TableHead>
            <StyledTableRow>
              <StyledTableCell align="center" colSpan={3}>
                Details
              </StyledTableCell>
              <StyledTableCell align="center" colSpan={6}>
                Price
              </StyledTableCell>
            </StyledTableRow>

            <StyledTableRow>
              <StyledTableCell align="left">No.</StyledTableCell>
              <StyledTableCell align="left">Code</StyledTableCell>
              <StyledTableCell align="left">Name</StyledTableCell>
              {!chargeType ? (
                <StyledTableCell align="right">IPD</StyledTableCell>
              ) : chargeType === "ipd" ? (
                <StyledTableCell align="right">IPD</StyledTableCell>
              ) : (
                <StyledTableCell align="right">IPD</StyledTableCell>
              )}

              {!chargeType ? (
                <StyledTableCell align="right">OPD</StyledTableCell>
              ) : chargeType === "opd" ? (
                <StyledTableCell align="right">OPD</StyledTableCell>
              ) : (
                <StyledTableCell align="right">OPD</StyledTableCell>
              )}

              {!chargeType ? (
                <StyledTableCell align="right">IPD INTL</StyledTableCell>
              ) : chargeType === "ipd_intl" ? (
                <StyledTableCell align="right">IPD INTL</StyledTableCell>
              ) : (
                <StyledTableCell align="right">IPD INTL</StyledTableCell>
              )}

              {!chargeType ? (
                <StyledTableCell align="right">OPD INTL</StyledTableCell>
              ) : chargeType === "opd_intl" ? (
                <StyledTableCell align="right">OPD INTL</StyledTableCell>
              ) : (
                <StyledTableCell align="right">OPD INTL</StyledTableCell>
              )}

              <StyledTableCell align="center">Qty.</StyledTableCell>
              <StyledTableCell align="center">Action</StyledTableCell>
            </StyledTableRow>
          </TableHead>

          <TableBody>
            {charges <= 0 ? (
              <StyledTableRow>
                <StyledTableCell align="center" colSpan={9}>
                  Item not found.
                </StyledTableCell>
              </StyledTableRow>
            ) : (
              charges.map((charge, index) => (
                <StyledTableRow key={charge.item_code}>
                  <StyledTableCell align="left">
                    <Typography variant="subtitle2" gutterBottom>
                      {index + 1}
                    </Typography>
                  </StyledTableCell>

                  <StyledTableCell align="left">
                    <Typography variant="subtitle2" gutterBottom>
                      {charge.item_code}
                    </Typography>
                  </StyledTableCell>

                  <StyledTableCell align="left">
                    <Typography variant="subtitle2" gutterBottom>
                      {charge.item_name_e}
                    </Typography>
                  </StyledTableCell>

                  {!chargeType ? (
                    <StyledTableCell align="right">
                      {charge.qty > 1 && (
                        <Typography
                          variant="subtitle2"
                          gutterBottom
                          sx={{ color: "#bdbdbd" }}
                        >
                          {numberWithCommas(ccyFormat(charge.mph_ipd))}
                        </Typography>
                      )}
                      <Tooltip
                        title={`MPH_IPD * Qty | ${charge.mph_ipd} * ${charge.qty}`}
                      >
                        <Typography variant="subtitle2" gutterBottom>
                          {numberWithCommas(
                            ccyFormat(charge.mph_ipd * charge.qty)
                          )}
                        </Typography>
                      </Tooltip>
                    </StyledTableCell>
                  ) : chargeType === "ipd" ? (
                    <StyledTableCell align="right">
                      {charge.qty > 1 && (
                        <Typography
                          variant="subtitle2"
                          gutterBottom
                          sx={{ color: "#bdbdbd" }}
                        >
                          {numberWithCommas(ccyFormat(charge.mph_ipd))}
                        </Typography>
                      )}
                      <Tooltip
                        title={`MPH_IPD * Qty | ${charge.mph_ipd} * ${charge.qty}`}
                      >
                        <Typography variant="subtitle2" gutterBottom>
                          {numberWithCommas(
                            ccyFormat(charge.mph_ipd * charge.qty)
                          )}
                        </Typography>
                      </Tooltip>
                    </StyledTableCell>
                  ) : (
                    <StyledTableCell align="right">0.00</StyledTableCell>
                  )}

                  {!chargeType ? (
                    <StyledTableCell align="right">
                      {charge.qty > 1 && (
                        <Typography
                          variant="subtitle2"
                          gutterBottom
                          sx={{ color: "#bdbdbd" }}
                        >
                          {numberWithCommas(ccyFormat(charge.mph_opd))}
                        </Typography>
                      )}
                      <Tooltip
                        title={`MPH_OPD * Qty | ${charge.mph_opd} * ${charge.qty}`}
                      >
                        <Typography variant="subtitle2" gutterBottom>
                          {numberWithCommas(
                            ccyFormat(charge.mph_opd * charge.qty)
                          )}
                        </Typography>
                      </Tooltip>
                    </StyledTableCell>
                  ) : chargeType === "opd" ? (
                    <StyledTableCell align="right">
                      {charge.qty > 1 && (
                        <Typography
                          variant="subtitle2"
                          gutterBottom
                          sx={{ color: "#bdbdbd" }}
                        >
                          {numberWithCommas(ccyFormat(charge.mph_opd))}
                        </Typography>
                      )}
                      <Tooltip
                        title={`MPH_OPD * Qty | ${charge.mph_opd} * ${charge.qty}`}
                      >
                        <Typography variant="subtitle2" gutterBottom>
                          {numberWithCommas(
                            ccyFormat(charge.mph_opd * charge.qty)
                          )}
                        </Typography>
                      </Tooltip>
                    </StyledTableCell>
                  ) : (
                    <StyledTableCell align="right">0.00</StyledTableCell>
                  )}

                  {!chargeType ? (
                    <StyledTableCell align="right">
                      {charge.qty > 1 && (
                        <Typography
                          variant="subtitle2"
                          gutterBottom
                          sx={{ color: "#bdbdbd" }}
                        >
                          {numberWithCommas(ccyFormat(charge.mph_ipd_intl))}
                        </Typography>
                      )}
                      <Tooltip
                        title={`MPH_IPD_INTL * Qty | ${charge.mph_ipd_intl} * ${charge.qty}`}
                      >
                        <Typography variant="subtitle2" gutterBottom>
                          {numberWithCommas(
                            ccyFormat(charge.mph_ipd_intl * charge.qty)
                          )}
                        </Typography>
                      </Tooltip>
                    </StyledTableCell>
                  ) : chargeType === "ipd_intl" ? (
                    <StyledTableCell align="right">
                      {charge.qty > 1 && (
                        <Typography
                          variant="subtitle2"
                          gutterBottom
                          sx={{ color: "#bdbdbd" }}
                        >
                          {numberWithCommas(ccyFormat(charge.mph_ipd_intl))}
                        </Typography>
                      )}
                      <Tooltip
                        title={`MPH_IPD_INTL * Qty | ${charge.mph_ipd_intl} * ${charge.qty}`}
                      >
                        <Typography variant="subtitle2" gutterBottom>
                          {numberWithCommas(
                            ccyFormat(charge.mph_ipd_intl * charge.qty)
                          )}
                        </Typography>
                      </Tooltip>
                    </StyledTableCell>
                  ) : (
                    <StyledTableCell align="right">0.00</StyledTableCell>
                  )}

                  {!chargeType ? (
                    <StyledTableCell align="right">
                      {charge.qty > 1 && (
                        <Typography
                          variant="subtitle2"
                          gutterBottom
                          sx={{ color: "#bdbdbd" }}
                        >
                          {numberWithCommas(ccyFormat(charge.mph_opd_intl))}
                        </Typography>
                      )}
                      <Tooltip
                        title={`MPH_OPD_INTL * Qty | ${charge.mph_opd_intl} * ${charge.qty}`}
                      >
                        <Typography variant="subtitle2" gutterBottom>
                          {numberWithCommas(
                            ccyFormat(charge.mph_opd_intl * charge.qty)
                          )}
                        </Typography>
                      </Tooltip>
                    </StyledTableCell>
                  ) : chargeType === "opd_intl" ? (
                    <StyledTableCell align="right">
                      {charge.qty > 1 && (
                        <Typography
                          variant="subtitle2"
                          gutterBottom
                          sx={{ color: "#bdbdbd" }}
                        >
                          {numberWithCommas(ccyFormat(charge.mph_opd_intl))}
                        </Typography>
                      )}
                      <Tooltip
                        title={`MPH_OPD_INTL * Qty | ${charge.mph_opd_intl} * ${charge.qty}`}
                      >
                        <Typography variant="subtitle2" gutterBottom>
                          {numberWithCommas(
                            ccyFormat(charge.mph_opd_intl * charge.qty)
                          )}
                        </Typography>
                      </Tooltip>
                    </StyledTableCell>
                  ) : (
                    <StyledTableCell align="right">0.00</StyledTableCell>
                  )}

                  {charge.isEditValue ? (
                    <StyledTableCell>
                      <SpanningTableEdit
                        editQtyCharge={editQtyCharge}
                        charge={charge}
                      />
                    </StyledTableCell>
                  ) : (
                    <StyledTableCell align="center">
                      <Typography variant="subtitle2" gutterBottom>
                        {charge.qty}
                      </Typography>
                    </StyledTableCell>
                  )}
                  <StyledTableCell align="center">
                    <Tooltip title="Edit" sx={{ marginLeft: "10px" }}>
                      <IconButton onClick={() => editCharge(charge.item_code)}>
                        <EditIcon />
                      </IconButton>
                    </Tooltip>

                    <Tooltip title="Delete">
                      <IconButton
                        onClick={() => deleteCharge(charge.item_code)}
                      >
                        <DeleteIcon sx={{ color: "red" }} />
                      </IconButton>
                    </Tooltip>
                  </StyledTableCell>
                </StyledTableRow>
              ))
            )}

            {charges <= 0 ? (
              ""
            ) : (
              <StyledTableRow>
                <StyledTableCell colSpan={2}></StyledTableCell>
                <StyledTableCell>
                  <Typography variant="subtitle2" gutterBottom>
                    Total
                  </Typography>
                </StyledTableCell>

                {!chargeType ? (
                  <StyledTableCell align="right">
                    <Tooltip title="Total MPH IPD">
                      <Typography variant="subtitle2" gutterBottom>
                        {numberWithCommas(ccyFormat(totalIPD()))}
                      </Typography>
                    </Tooltip>
                  </StyledTableCell>
                ) : chargeType === "ipd" ? (
                  <StyledTableCell align="right">
                    <Tooltip title="Total MPH IPD">
                      <Typography variant="subtitle2" gutterBottom>
                        {numberWithCommas(ccyFormat(totalIPD()))}
                      </Typography>
                    </Tooltip>
                  </StyledTableCell>
                ) : (
                  <StyledTableCell align="right">0.00</StyledTableCell>
                )}

                {!chargeType ? (
                  <StyledTableCell align="right">
                    <Tooltip title="Total MPH OPD">
                      <Typography variant="subtitle2" gutterBottom>
                        {numberWithCommas(ccyFormat(totalOPD()))}
                      </Typography>
                    </Tooltip>
                  </StyledTableCell>
                ) : chargeType === "opd" ? (
                  <StyledTableCell align="right">
                    <Tooltip title="Total MPH OPD">
                      <Typography variant="subtitle2" gutterBottom>
                        {numberWithCommas(ccyFormat(totalOPD()))}
                      </Typography>
                    </Tooltip>
                  </StyledTableCell>
                ) : (
                  <StyledTableCell align="right">0.00</StyledTableCell>
                )}

                {!chargeType ? (
                  <StyledTableCell align="right">
                    <Tooltip title="Total MPH IPD INTL">
                      <Typography variant="subtitle2" gutterBottom>
                        {numberWithCommas(ccyFormat(totalIPD_INTL()))}
                      </Typography>
                    </Tooltip>
                  </StyledTableCell>
                ) : chargeType === "ipd_intl" ? (
                  <StyledTableCell align="right">
                    <Tooltip title="Total MPH IPD INTL">
                      <Typography variant="subtitle2" gutterBottom>
                        {numberWithCommas(ccyFormat(totalIPD_INTL()))}
                      </Typography>
                    </Tooltip>
                  </StyledTableCell>
                ) : (
                  <StyledTableCell align="right">0.00</StyledTableCell>
                )}

                {!chargeType ? (
                  <StyledTableCell align="right">
                    <Tooltip title="Total MPH OPD INTL">
                      <Typography variant="subtitle2" gutterBottom>
                        {numberWithCommas(ccyFormat(totalOPD_INTL()))}
                      </Typography>
                    </Tooltip>
                  </StyledTableCell>
                ) : chargeType === "opd_intl" ? (
                  <StyledTableCell align="right">
                    <Tooltip title="Total MPH OPD INTL">
                      <Typography variant="subtitle2" gutterBottom>
                        {numberWithCommas(ccyFormat(totalOPD_INTL()))}
                      </Typography>
                    </Tooltip>
                  </StyledTableCell>
                ) : (
                  <StyledTableCell align="right">0.00</StyledTableCell>
                )}

                <StyledTableCell align="center">
                  <Tooltip title="Total Qty">
                    <Typography variant="subtitle2" gutterBottom>
                      {totalQty()}
                    </Typography>
                  </Tooltip>
                </StyledTableCell>
                <StyledTableCell align="center">
                  <Tooltip title="Download excel">
                    <IconButton onClick={exportExcelFile}>
                      <FileDownloadIcon />
                    </IconButton>
                  </Tooltip>

                  <Tooltip title="Reset charge type">
                    <IconButton onClick={handleChargeType}>
                      <RestartAltIcon />
                    </IconButton>
                  </Tooltip>
                </StyledTableCell>
              </StyledTableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
}
