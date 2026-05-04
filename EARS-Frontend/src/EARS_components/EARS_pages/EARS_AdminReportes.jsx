import React, { useState, useEffect } from 'react';
import { EARS_ApiFetch } from '../../EARS_services/EARS_Api.js';
import { PDFDownloadLink, Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import EARS_Button from '../EARS_atoms/EARS_Button.jsx';
import { Download } from 'lucide-react';

const styles = StyleSheet.create({
  page: { padding: 40, fontFamily: 'Helvetica' },
  header: { marginBottom: 30, textAlign: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', color: '#1e293b', marginBottom: 5 },
  subtitle: { fontSize: 12, color: '#64748b' },
  table: { display: 'table', width: 'auto', borderStyle: 'solid', borderWidth: 1, borderRightWidth: 0, borderBottomWidth: 0 },
  tableRow: { margin: 'auto', flexDirection: 'row' },
  tableColHeader: { width: '25%', borderStyle: 'solid', borderWidth: 1, borderLeftWidth: 0, borderTopWidth: 0, backgroundColor: '#f1f5f9' },
  tableCol: { width: '25%', borderStyle: 'solid', borderWidth: 1, borderLeftWidth: 0, borderTopWidth: 0 },
  tableCellHeader: { margin: 5, fontSize: 10, fontWeight: 'bold', color: '#334155' },
  tableCell: { margin: 5, fontSize: 10, color: '#475569' },
  footer: { position: 'absolute', bottom: 30, left: 40, right: 40, fontSize: 10, color: '#94a3b8', textAlign: 'center' }
});

const ReportePDF = ({ title, data, columns }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <Text style={styles.title}>EARS Microfinanciera</Text>
        <Text style={styles.subtitle}>{title} - Generado el {new Date().toLocaleDateString()}</Text>
      </View>
      
      <View style={styles.table}>
        {/* Table Header */}
        <View style={styles.tableRow}>
          {columns.map((col, i) => (
            <View key={i} style={styles.tableColHeader}>
              <Text style={styles.tableCellHeader}>{col.header}</Text>
            </View>
          ))}
        </View>
        {/* Table Body */}
        {data.map((row, rowIndex) => (
          <View key={rowIndex} style={styles.tableRow}>
            {columns.map((col, colIndex) => (
              <View key={colIndex} style={styles.tableCol}>
                <Text style={styles.tableCell}>
                  {col.render ? col.render(row) : row[col.accessor]}
                </Text>
              </View>
            ))}
          </View>
        ))}
      </View>

      <Text style={styles.footer}>Este documento es confidencial y de uso exclusivo de EARS Microfinanciera.</Text>
    </Page>
  </Document>
);

const EARS_AdminReportes = () => {
  const [cartera, setCartera] = useState([]);
  const [mora, setMora] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const carteraData = await EARS_ApiFetch('/reporte/cartera-pendiente');
        setCartera(carteraData);
        const moraData = await EARS_ApiFetch('/reporte/creditos-mora');
        setMora(moraData);
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
    { header: 'Días Mora', accessor: 'dias_mora' },
    { header: 'Interés Mora ($)', accessor: 'interes_mora' },
  ];

  return (
    <div>
      <h1 className="ears-page-title">Exportación de Reportes PDF</h1>
      <div style={{ display: 'grid', gap: '2rem', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
        
        <div className="ears-glass" style={{ padding: '2rem', borderRadius: 'var(--ears-radius-lg)', textAlign: 'center' }}>
          <h2 style={{ marginBottom: '1rem', color: 'var(--ears-warning)' }}>Cartera Pendiente</h2>
          <p style={{ marginBottom: '2rem', color: 'var(--ears-text-muted)' }}>Exportar el listado completo de cuotas por cobrar en el sistema.</p>
          {cartera.length > 0 ? (
            <PDFDownloadLink document={<ReportePDF title="Reporte de Cartera Pendiente" data={cartera} columns={columnsCartera} />} fileName="cartera_pendiente.pdf">
              {({ loading }) => (
                <EARS_Button disabled={loading} variant="primary" fullWidth>
                  <Download size={20} /> {loading ? 'Generando PDF...' : 'Descargar PDF'}
                </EARS_Button>
              )}
            </PDFDownloadLink>
          ) : (
            <p>Cargando datos...</p>
          )}
        </div>

        <div className="ears-glass" style={{ padding: '2rem', borderRadius: 'var(--ears-radius-lg)', textAlign: 'center' }}>
          <h2 style={{ marginBottom: '1rem', color: 'var(--ears-danger)' }}>Créditos en Mora</h2>
          <p style={{ marginBottom: '2rem', color: 'var(--ears-text-muted)' }}>Exportar el listado de clientes y cuotas con atrasos e intereses sumados.</p>
          {mora.length > 0 ? (
            <PDFDownloadLink document={<ReportePDF title="Reporte de Créditos en Mora" data={mora} columns={columnsMora} />} fileName="creditos_mora.pdf">
              {({ loading }) => (
                <EARS_Button disabled={loading} variant="primary" fullWidth>
                  <Download size={20} /> {loading ? 'Generando PDF...' : 'Descargar PDF'}
                </EARS_Button>
              )}
            </PDFDownloadLink>
          ) : (
            <p>Cargando datos...</p>
          )}
        </div>

      </div>
    </div>
  );
};

export default EARS_AdminReportes;
