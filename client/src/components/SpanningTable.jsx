import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
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
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import SpanningTableEdit from "./SpanningTableEdit";
import Typography from "@mui/material/Typography";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import NoteAddIcon from "@mui/icons-material/NoteAdd";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import ExcelJS from "exceljs";
import PlaylistAddIcon from "@mui/icons-material/PlaylistAdd";
import Autocomplete from "@mui/material/Autocomplete";
import PrintIcon from "@mui/icons-material/Print";
import readXlsxFile from "read-excel-file";
import {
  postTemplate,
  getTemplateByUID,
  getTemplateItemsDetail,
  deleteTemplate,
  postPrintTemplate,
} from "../redux/actions/templateAction";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  borderRadius: "10px",
  boxShadow: 24,
  p: 4,
};

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
  setCharges,
  deleteCharge,
  editCharge,
  editQtyCharge,
  chargeType,
  setChargeType,
  addChargesWithFile,
}) {
  const auth = useSelector((state) => state.auth);
  const templates = useSelector((state) => state.template.templates);
  const printId = useSelector((state) => state.template.printId);
  const [templateName, setTemplateName] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [HN, setHN] = useState("");
  const ref = useRef(null);

  const [openSaveTemplate, setOpenSaveTemplate] = useState(false);
  const handleOpenSaveTemplate = () => setOpenSaveTemplate(true);
  const handleCloseSaveTemplate = () => setOpenSaveTemplate(false);

  const [openAddTemplate, setOpenAddTemplate] = useState(false);
  const handleOpenAddTemplate = () => setOpenAddTemplate(true);
  const handleCloseAddTemplate = () => setOpenAddTemplate(false);

  const [openPrintTemplate, setOpenPrintTemplate] = useState(false);
  const handleOpenPrintTemplate = () => setOpenPrintTemplate(true);
  const handleClosePrintTemplate = () => setOpenPrintTemplate(false);

  const dispatch = useDispatch();

  useEffect(() => {
    if (auth.token) {
      dispatch(getTemplateByUID(auth));
    }
  }, [auth]);

  useEffect(() => {
    if (printId) {
      window.open(
        `https://mpuser:P%40ssw0rd@d1vd-dsql-mp-01.medparkhospital.com/Reports/report/IT%20Reports/Price_Estimate_APP/Price_Estimate_Report?HN=${HN}&charge_type=${chargeType}&PE_print_UID=${printId}&PE_user_UID=${auth?.user.id}&rs:Command=Render&rc:Parameters=false`,
        "_blank"
      );

      setHN("");
    }
  }, [printId]);

  function ccyFormat(num) {
    return `${num?.toFixed(2)}`;
  }

  function totalForDoctor() {
    return (totalForDoctor = charges
      .map((charge) => charge.doctor * charge.qty)
      .reduce((sum, i) => sum + i, 0));
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

  const handleSubmitSaveTemplate = (e) => {
    e.preventDefault();

    const template = {
      templateName,
      charges,
    };

    dispatch(postTemplate(auth, { template }));

    setOpenSaveTemplate(false);
  };

  const handleSubmitSelectTemplate = (e) => {
    e.preventDefault();

    dispatch(getTemplateItemsDetail(auth, { selectedTemplate }));

    setOpenAddTemplate(false);
  };

  const handleDeleteTemplate = () => {
    dispatch(deleteTemplate(auth, { selectedTemplate }));

    setOpenAddTemplate(false);
  };

  const handlePrintTemplate = (e) => {
    e.preventDefault();

    const newPrintTemplate = {
      HN,
      charges,
    };

    dispatch(postPrintTemplate(auth, { newPrintTemplate }));

    setOpenPrintTemplate(false);
  };

  const handleClearItem = () => {
    setCharges([]);
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

  const inputfile = document.getElementById("inputfile");
  inputfile?.addEventListener("change", () => {
    readXlsxFile(inputfile.files[0]).then((rows) => {
      let cutFirstRow = rows.slice(1);

      addChargesWithFile(cutFirstRow);

      ref.current && (ref.current.value = "");
    });
  });

  return (
    <Box>
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

              <StyledTableCell align="center" colSpan={1}>
                <Tooltip title="Upload file excel">
                  <input
                    type="file"
                    id="inputfile"
                    name="inputfile"
                    accept=".xlsx"
                    ref={ref}
                  />
                </Tooltip>

                <Tooltip title="Select or delete template">
                  <IconButton onClick={handleOpenAddTemplate}>
                    <PlaylistAddIcon sx={{ color: "white" }} />
                  </IconButton>
                </Tooltip>

                {charges.length > 0 && (
                  <Tooltip title="Clear item">
                    <IconButton onClick={handleClearItem}>
                      <RestartAltIcon sx={{ color: "white" }} />
                    </IconButton>
                  </Tooltip>
                )}
              </StyledTableCell>
            </StyledTableRow>

            <StyledTableRow>
              <StyledTableCell align="left">No.</StyledTableCell>
              <StyledTableCell align="left">Code</StyledTableCell>
              <StyledTableCell align="left">Name</StyledTableCell>

              {!chargeType ? (
                <StyledTableCell align="right">For Doctor</StyledTableCell>
              ) : chargeType === "for_doctor" ? (
                <StyledTableCell align="right">For Doctor</StyledTableCell>
              ) : (
                <StyledTableCell align="right">For Doctor</StyledTableCell>
              )}

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
                <StyledTableCell align="center" colSpan={10}>
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
                          {numberWithCommas(ccyFormat(charge.doctor))}
                        </Typography>
                      )}
                      <>
                        <Typography variant="subtitle2" gutterBottom>
                          {numberWithCommas(
                            ccyFormat(charge.doctor * charge.qty)
                          )}
                        </Typography>
                      </>
                    </StyledTableCell>
                  ) : chargeType === "for_doctor" ? (
                    <StyledTableCell align="right">
                      {charge.qty > 1 && (
                        <Typography
                          variant="subtitle2"
                          gutterBottom
                          sx={{ color: "#bdbdbd" }}
                        >
                          {numberWithCommas(ccyFormat(charge.doctor))}
                        </Typography>
                      )}
                      <>
                        <Typography variant="subtitle2" gutterBottom>
                          {numberWithCommas(
                            ccyFormat(charge.doctor * charge.qty)
                          )}
                        </Typography>
                      </>
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
                          {numberWithCommas(ccyFormat(charge.mph_ipd))}
                        </Typography>
                      )}
                      <Tooltip
                        title={`IPD * Qty | ${charge.mph_ipd} * ${charge.qty}`}
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
                        title={`IPD * Qty | ${charge.mph_ipd} * ${charge.qty}`}
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
                        title={`OPD * Qty | ${charge.mph_opd} * ${charge.qty}`}
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
                        title={`OPD * Qty | ${charge.mph_opd} * ${charge.qty}`}
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
                        title={`IPD INTL * Qty | ${charge.mph_ipd_intl} * ${charge.qty}`}
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
                        title={`IPD INTL * Qty | ${charge.mph_ipd_intl} * ${charge.qty}`}
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
                        title={`OPD INTL * Qty | ${charge.mph_opd_intl} * ${charge.qty}`}
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
                        title={`OPD INTL * Qty | ${charge.mph_opd_intl} * ${charge.qty}`}
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
                    <Tooltip title="Total For Doctor">
                      <Typography variant="subtitle2" gutterBottom>
                        {numberWithCommas(ccyFormat(totalForDoctor()))}
                      </Typography>
                    </Tooltip>
                  </StyledTableCell>
                ) : chargeType === "for_doctor" ? (
                  <StyledTableCell align="right">
                    <Tooltip title="Total For Doctor">
                      <Typography variant="subtitle2" gutterBottom>
                        {numberWithCommas(ccyFormat(totalForDoctor()))}
                      </Typography>
                    </Tooltip>
                  </StyledTableCell>
                ) : (
                  <StyledTableCell align="right">0.00</StyledTableCell>
                )}

                {!chargeType ? (
                  <StyledTableCell align="right">
                    <Tooltip title="Total IPD">
                      <Typography variant="subtitle2" gutterBottom>
                        {numberWithCommas(ccyFormat(totalIPD()))}
                      </Typography>
                    </Tooltip>
                  </StyledTableCell>
                ) : chargeType === "ipd" ? (
                  <StyledTableCell align="right">
                    <Tooltip title="Total IPD">
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
                    <Tooltip title="Total OPD">
                      <Typography variant="subtitle2" gutterBottom>
                        {numberWithCommas(ccyFormat(totalOPD()))}
                      </Typography>
                    </Tooltip>
                  </StyledTableCell>
                ) : chargeType === "opd" ? (
                  <StyledTableCell align="right">
                    <Tooltip title="Total OPD">
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
                    <Tooltip title="Total IPD INTL">
                      <Typography variant="subtitle2" gutterBottom>
                        {numberWithCommas(ccyFormat(totalIPD_INTL()))}
                      </Typography>
                    </Tooltip>
                  </StyledTableCell>
                ) : chargeType === "ipd_intl" ? (
                  <StyledTableCell align="right">
                    <Tooltip title="Total IPD INTL">
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
                    <Tooltip title="Total OPD INTL">
                      <Typography variant="subtitle2" gutterBottom>
                        {numberWithCommas(ccyFormat(totalOPD_INTL()))}
                      </Typography>
                    </Tooltip>
                  </StyledTableCell>
                ) : chargeType === "opd_intl" ? (
                  <StyledTableCell align="right">
                    <Tooltip title="Total OPD INTL">
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
                  <Tooltip title="Reset charge type">
                    <IconButton onClick={handleChargeType}>
                      <RestartAltIcon />
                    </IconButton>
                  </Tooltip>

                  <Tooltip title="Create template">
                    <IconButton onClick={handleOpenSaveTemplate}>
                      <NoteAddIcon />
                    </IconButton>
                  </Tooltip>

                  {auth?.user.is_print === "Y" ? (
                    <Tooltip title="Download excel">
                      <IconButton onClick={exportExcelFile}>
                        <FileDownloadIcon />
                      </IconButton>
                    </Tooltip>
                  ) : (
                    ""
                  )}

                  {auth?.user.is_print === "Y" ? (
                    <Tooltip title="Print">
                      <IconButton onClick={handleOpenPrintTemplate}>
                        <PrintIcon />
                      </IconButton>
                    </Tooltip>
                  ) : (
                    ""
                  )}
                </StyledTableCell>
              </StyledTableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Modal
        open={openSaveTemplate}
        onClose={handleCloseSaveTemplate}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Create template
          </Typography>

          <Box component="form" onSubmit={handleSubmitSaveTemplate}>
            <TextField
              fullWidth
              id="outlined-basic"
              label="Name template"
              variant="outlined"
              name="template"
              value={templateName}
              onChange={(e) => setTemplateName(e.target.value)}
              sx={{ my: "20px" }}
            />

            <Button type="submit" variant="contained" fullWidth>
              Create
            </Button>
          </Box>
        </Box>
      </Modal>

      <Modal
        open={openAddTemplate}
        onClose={handleCloseAddTemplate}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Select or delete template
          </Typography>

          <Box component="form" onSubmit={handleSubmitSelectTemplate}>
            <Autocomplete
              disablePortal
              disableClearable
              id="combo-box-demo"
              options={templates}
              getOptionLabel={(templates) => `${templates.template_name}`}
              onChange={(event, newValue) => {
                setSelectedTemplate(newValue.template_UID);
              }}
              sx={{ my: "20px" }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Select template"
                  sx={{
                    background: "white",
                    borderRadius: "5px",
                  }}
                />
              )}
            />
            <Button type="submit" variant="contained" fullWidth>
              Select
            </Button>
          </Box>

          <Button
            type="submit"
            variant="contained"
            fullWidth
            color="error"
            onClick={handleDeleteTemplate}
            sx={{ marginTop: "10px" }}
          >
            Delete
          </Button>
        </Box>
      </Modal>

      <Modal
        open={openPrintTemplate}
        onClose={handleClosePrintTemplate}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Print
          </Typography>

          <Box>
            <TextField
              fullWidth
              id="outlined-basic"
              label="HN"
              variant="outlined"
              name="HN"
              value={HN}
              onChange={(e) => setHN(e.target.value)}
              sx={{ my: "20px" }}
            />
          </Box>

          <Button
            type="submit"
            variant="contained"
            fullWidth
            onClick={handlePrintTemplate}
            disabled={
              !chargeType || !HN || chargeType === "for_doctor" ? true : false
            }
          >
            Print
          </Button>
        </Box>
      </Modal>
    </Box>
  );
}
