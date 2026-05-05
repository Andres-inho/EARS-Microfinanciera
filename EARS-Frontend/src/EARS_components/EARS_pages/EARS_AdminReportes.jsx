import React, { useState, useEffect } from 'react';
import { EARS_ApiFetch } from '../../EARS_services/EARS_Api.js';
import { PDFDownloadLink, Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import EARS_Button from '../EARS_atoms/EARS_Button.jsx';
import { Download } from 'lucide-react';

const styles = StyleSheet.create({
  page: { padding: 40, fontFamily: 'Helvetica' },
  header: { marginBottom: 20, textAlign: 'center' },
  title: { fontSize: 26, fontWeight: 'bold', color: '#0284c7', marginBottom: 8 },
  subtitle: { fontSize: 12, color: '#475569', marginBottom: 15 },
  description: { fontSize: 11, color: '#334155', textAlign: 'justify', marginBottom: 20, lineHeight: 1.5 },
  table: { display: 'table', width: '100%', borderStyle: 'solid', borderWidth: 1, borderColor: '#cbd5e1', borderRightWidth: 0, borderBottomWidth: 0 },
  tableRow: { margin: 'auto', flexDirection: 'row' },
  tableCellHeader: { margin: 5, fontSize: 10, fontWeight: 'bold', color: '#0f172a' },
  tableCell: { margin: 5, fontSize: 9, color: '#334155' },
  footer: { position: 'absolute', bottom: 30, left: 40, right: 40, fontSize: 10, color: '#94a3b8', textAlign: 'center', borderTopWidth: 1, borderTopColor: '#e2e8f0', paddingTop: 10 }
});

const ReportePDF = ({ title, data, columns, description }) => {
  const colWidth = `${100 / columns.length}%`;
  
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>EARS Microfinanciera</Text>
          <Text style={styles.subtitle}>{title} - Generado el {new Date().toLocaleDateString()}</Text>
          {description && <Text style={styles.description}>{description}</Text>}
        </View>
        
        <View style={styles.table}>
          {/* Table Header */}
          <View style={styles.tableRow}>
            {columns.map((col, i) => (
              <View key={i} style={{ width: colWidth, borderStyle: 'solid', borderWidth: 1, borderColor: '#cbd5e1', borderLeftWidth: 0, borderTopWidth: 0, backgroundColor: '#f1f5f9' }}>
                <Text style={styles.tableCellHeader}>{col.header}</Text>
              </View>
            ))}
          </View>
          {/* Table Body */}
          {data.map((row, rowIndex) => (
            <View key={rowIndex} style={styles.tableRow}>
              {columns.map((col, colIndex) => (
                <View key={colIndex} style={{ width: colWidth, borderStyle: 'solid', borderWidth: 1, borderColor: '#cbd5e1', borderLeftWidth: 0, borderTopWidth: 0 }}>
                  <Text style={styles.tableCell}>
                    {col.render ? col.render(row) : row[col.accessor]}
                  </Text>
                </View>
              ))}
            </View>
          ))}
        </View>

        <Text style={styles.footer}>Este documento financiero es confidencial y de uso exclusivo de EARS Microfinanciera. Generado automáticamente por el sistema.</Text>
      </Page>
    </Document>
  );
};

const EARS_AdminReportes = () => {
  const [cartera, setCartera] = useState([]);
  const [mora, setMora] = useState([]);
  const [prestado, setPrestado] = useState([]);
  const [recaudado, setRecaudado] = useState([]);
  const [flujo, setFlujo] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const carteraData = await EARS_ApiFetch('/reporte/cartera-pendiente');
        setCartera(carteraData);
        const moraData = await EARS_ApiFetch('/reporte/creditos-mora');
        setMora(moraData);
        const prestadoData = await EARS_ApiFetch('/reporte/total-prestado');
        setPrestado(prestadoData);
        const recaudadoData = await EARS_ApiFetch('/reporte/total-recaudado');
        setRecaudado(recaudadoData);
        const flujoData = await EARS_ApiFetch('/reporte/flujo-caja');
        setFlujo(flujoData);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []);

  const columnsCartera = [
    { header: 'Cuota ID', accessor: 'id_cuota' },
    { header: 'Préstamo ID', accessor: 'id_prestamo' },
    { header: 'Cliente ID', accessor: 'persona' },
    { header: 'Valor ($)', accessor: 'valor' },
  ];

  const columnsMora = [
    { header: 'Cuota ID', accessor: 'id_cuota' },
    { header: 'Préstamo ID', accessor: 'id_prestamo' },
    { header: 'Días Mora', accessor: 'dias_retraso' },
    { header: 'Interés Mora ($)', accessor: 'valor_mora' },
  ];

  const columnsPrestado = [
    { header: 'Préstamo', accessor: 'id_prestamo' },
    { header: 'Cliente', accessor: 'persona_nombre' },
    { header: 'Fecha', render: (row) => new Date(row.fecha_prestamo).toLocaleDateString() },
    { header: 'Valor ($)', accessor: 'valor_prestado' }
  ];

  const columnsRecaudado = [
    { header: 'Pago', accessor: 'id_pago' },
    { header: 'Préstamo', accessor: 'id_prestamo' },
    { header: 'Cliente', accessor: 'cliente' },
    { header: 'Fecha', render: (row) => new Date(row.fecha_pago).toLocaleDateString() },
    { header: 'Valor ($)', accessor: 'valor' }
  ];

  const columnsFlujo = [
    { header: 'Mov.', accessor: 'id_movimiento' },
    { header: 'Fecha', render: (row) => new Date(row.fecha).toLocaleDateString() },
    { header: 'Tipo', accessor: 'tipo' },
    { header: 'Valor ($)', accessor: 'valor' }
  ];

  return (
    <div>
      <h1 className="ears-page-title">Exportación de Reportes PDF</h1>
      <div style={{ display: 'grid', gap: '2rem', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
        
        <div className="ears-glass" style={{ padding: '2rem', borderRadius: 'var(--ears-radius-lg)', textAlign: 'center' }}>
          <h2 style={{ marginBottom: '1rem', color: 'var(--ears-primary)' }}>Total Prestado</h2>
          <p style={{ marginBottom: '2rem', color: 'var(--ears-text-muted)' }}>Listado de todos los préstamos históricos realizados y activos.</p>
          {prestado.length > 0 ? (
            <PDFDownloadLink document={<ReportePDF title="Reporte de Total Prestado" data={prestado} columns={columnsPrestado} description="Este informe detalla el histórico completo de préstamos otorgados por la microfinanciera, incluyendo la información de los clientes beneficiarios y los montos iniciales desembolsados. Esta información es fundamental para la auditoría de activos." />} fileName="total_prestado.pdf">
              {({ loading }) => (
                <EARS_Button disabled={loading} variant="primary" fullWidth>
                  <Download size={20} /> {loading ? 'Generando PDF...' : 'Descargar PDF'}
                </EARS_Button>
              )}
            </PDFDownloadLink>
          ) : (
            <p>Cargando datos o sin registros...</p>
          )}
        </div>

        <div className="ears-glass" style={{ padding: '2rem', borderRadius: 'var(--ears-radius-lg)', textAlign: 'center' }}>
          <h2 style={{ marginBottom: '1rem', color: 'var(--ears-success)' }}>Total Recaudado</h2>
          <p style={{ marginBottom: '2rem', color: 'var(--ears-text-muted)' }}>Listado de todos los pagos de cuotas ingresados al sistema.</p>
          {recaudado.length > 0 ? (
            <PDFDownloadLink document={<ReportePDF title="Reporte de Pagos Recaudados" data={recaudado} columns={columnsRecaudado} description="Este informe detalla todos los ingresos registrados en el sistema por concepto de pagos de cuotas. Representa el flujo de dinero entrante real (recaudos) que incrementa la liquidez de la institución financiera." />} fileName="total_recaudado.pdf">
              {({ loading }) => (
                <EARS_Button disabled={loading} variant="primary" fullWidth>
                  <Download size={20} /> {loading ? 'Generando PDF...' : 'Descargar PDF'}
                </EARS_Button>
              )}
            </PDFDownloadLink>
          ) : (
            <p>Cargando datos o sin registros...</p>
          )}
        </div>

        <div className="ears-glass" style={{ padding: '2rem', borderRadius: 'var(--ears-radius-lg)', textAlign: 'center' }}>
          <h2 style={{ marginBottom: '1rem', color: 'var(--ears-warning)' }}>Cartera Pendiente</h2>
          <p style={{ marginBottom: '2rem', color: 'var(--ears-text-muted)' }}>Exportar el listado completo de cuotas por cobrar en el sistema.</p>
          {cartera.length > 0 ? (
            <PDFDownloadLink document={<ReportePDF title="Reporte de Cartera Pendiente" data={cartera} columns={columnsCartera} description="Este reporte contiene el inventario de todas las cuotas que se encuentran en estado pendiente. Constituye las cuentas por cobrar que aún están dentro de sus tiempos legales de pago, siendo la proyección de ingresos a corto y mediano plazo." />} fileName="cartera_pendiente.pdf">
              {({ loading }) => (
                <EARS_Button disabled={loading} variant="primary" fullWidth>
                  <Download size={20} /> {loading ? 'Generando PDF...' : 'Descargar PDF'}
                </EARS_Button>
              )}
            </PDFDownloadLink>
          ) : (
            <p>Cargando datos o sin registros...</p>
          )}
        </div>

        <div className="ears-glass" style={{ padding: '2rem', borderRadius: 'var(--ears-radius-lg)', textAlign: 'center' }}>
          <h2 style={{ marginBottom: '1rem', color: 'var(--ears-danger)' }}>Créditos en Mora</h2>
          <p style={{ marginBottom: '2rem', color: 'var(--ears-text-muted)' }}>Exportar el listado de clientes y cuotas con atrasos e intereses.</p>
          {mora.length > 0 ? (
            <PDFDownloadLink document={<ReportePDF title="Reporte de Créditos en Mora" data={mora} columns={columnsMora} description="El presente documento es un reporte de alerta máxima. Lista las cuotas cuyo plazo legal de pago ha vencido. Incluye el cálculo automático de días de retraso y los intereses moratorios generados al día de hoy que deben ser cobrados a los clientes." />} fileName="creditos_mora.pdf">
              {({ loading }) => (
                <EARS_Button disabled={loading} variant="primary" fullWidth>
                  <Download size={20} /> {loading ? 'Generando PDF...' : 'Descargar PDF'}
                </EARS_Button>
              )}
            </PDFDownloadLink>
          ) : (
            <p>Cargando datos o sin registros...</p>
          )}
        </div>

        <div className="ears-glass" style={{ padding: '2rem', borderRadius: 'var(--ears-radius-lg)', textAlign: 'center' }}>
          <h2 style={{ marginBottom: '1rem', color: 'var(--ears-text-main)' }}>Flujo de Caja</h2>
          <p style={{ marginBottom: '2rem', color: 'var(--ears-text-muted)' }}>Listado de todos los movimientos financieros (ingresos y egresos).</p>
          {flujo.length > 0 ? (
            <PDFDownloadLink document={<ReportePDF title="Reporte de Flujo de Caja" data={flujo} columns={columnsFlujo} description="Registro contable maestro. Este reporte unifica todas las transacciones financieras (tanto ingresos por pagos como egresos por gastos o préstamos), ordenadas cronológicamente para visualizar la salud financiera de la caja." />} fileName="flujo_caja.pdf">
              {({ loading }) => (
                <EARS_Button disabled={loading} variant="primary" fullWidth>
                  <Download size={20} /> {loading ? 'Generando PDF...' : 'Descargar PDF'}
                </EARS_Button>
              )}
            </PDFDownloadLink>
          ) : (
            <p>Cargando datos o sin registros...</p>
          )}
        </div>

      </div>
    </div>
  );
};

export default EARS_AdminReportes;
