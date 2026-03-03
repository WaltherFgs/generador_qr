import React, { useState, useRef, useEffect } from 'react';
import { QRCodeCanvas, QRCodeSVG } from 'qrcode.react';
import { Download, QrCode, Settings2, Link as LinkIcon, Wifi, User, Mail, Image as ImageIcon, Trash2 } from 'lucide-react';

export default function QRGenerator() {
    // Tabs: 'url', 'wifi', 'vcard', 'email'
    const [activeTab, setActiveTab] = useState('url');

    // Data States
    const [urlData, setUrlData] = useState('https://www.bbc.com/mundo');
    const [wifiData, setWifiData] = useState({ ssid: '', password: '', encryption: 'WPA', hidden: false });
    const [vcardData, setVcardData] = useState({ firstName: '', lastName: '', phone: '', email: '', company: '' });
    const [emailData, setEmailData] = useState({ to: '', subject: '', body: '' });

    // Customization States
    const [fgColor, setFgColor] = useState('#0f172a');
    const [bgColor, setBgColor] = useState('#ffffff');
    const [size, setSize] = useState(280);
    const [level, setLevel] = useState('H');
    const [logoUrl, setLogoUrl] = useState('');

    const [qrValue, setQrValue] = useState('');
    const qrRef = useRef(null);

    // Computed QR Value based on active tab
    useEffect(() => {
        switch (activeTab) {
            case 'url':
                setQrValue(urlData || 'https://');
                break;
            case 'wifi':
                setQrValue(`WIFI:S:${wifiData.ssid};T:${wifiData.encryption};P:${wifiData.password};H:${wifiData.hidden};;`);
                break;
            case 'vcard':
                const vcard = `BEGIN:VCARD\nVERSION:3.0\nN:${vcardData.lastName};${vcardData.firstName};;;\nFN:${vcardData.firstName} ${vcardData.lastName}\nORG:${vcardData.company}\nTEL;TYPE=CELL:${vcardData.phone}\nEMAIL:${vcardData.email}\nEND:VCARD`;
                setQrValue(vcard);
                break;
            case 'email':
                setQrValue(`mailto:${emailData.to}?subject=${encodeURIComponent(emailData.subject)}&body=${encodeURIComponent(emailData.body)}`);
                break;
            default:
                setQrValue('');
        }
    }, [activeTab, urlData, wifiData, vcardData, emailData]);

    // Handlers for Export
    const handleDownloadPNG = () => {
        const canvas = qrRef.current?.querySelector('canvas');
        if (!canvas) return;

        const pngUrl = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
        let downloadLink = document.createElement("a");
        downloadLink.href = pngUrl;
        downloadLink.download = "qr-premium.png";
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
    };

    const handleDownloadSVG = () => {
        const svg = qrRef.current?.querySelector('svg');
        if (!svg) return;

        const svgData = new XMLSerializer().serializeToString(svg);
        const blob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
        const url = URL.createObjectURL(blob);

        let downloadLink = document.createElement("a");
        downloadLink.href = url;
        downloadLink.download = "qr-premium-vector.svg";
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
        URL.revokeObjectURL(url);
    };

    const handleLogoUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => setLogoUrl(event.target.result);
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="main-grid">
            {/* Controles y Plantillas */}
            <div className="glass-panel controls-panel" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

                {/* Sistema de Pestañas (Tabs) */}
                <div className="tabs-container">
                    <button className={`tab-btn ${activeTab === 'url' ? 'active' : ''}`} onClick={() => setActiveTab('url')}>
                        <LinkIcon size={18} /> URL
                    </button>
                    <button className={`tab-btn ${activeTab === 'wifi' ? 'active' : ''}`} onClick={() => setActiveTab('wifi')}>
                        <Wifi size={18} /> WiFi
                    </button>
                    <button className={`tab-btn ${activeTab === 'vcard' ? 'active' : ''}`} onClick={() => setActiveTab('vcard')}>
                        <User size={18} /> Contacto
                    </button>
                    <button className={`tab-btn ${activeTab === 'email' ? 'active' : ''}`} onClick={() => setActiveTab('email')}>
                        <Mail size={18} /> Email
                    </button>
                </div>

                {/* Dynamic Forms based on Active Tab */}
                <div className="tab-content animate-fade-in" key={activeTab}>
                    {activeTab === 'url' && (
                        <div className="form-group">
                            <label className="form-label">Contenido / URL</label>
                            <input type="text" value={urlData} onChange={(e) => setUrlData(e.target.value)} placeholder="https://..." />
                        </div>
                    )}

                    {activeTab === 'wifi' && (
                        <div className="grid-2-cols">
                            <div className="form-group">
                                <label className="form-label">Nombre de Red (SSID)</label>
                                <input type="text" value={wifiData.ssid} onChange={(e) => setWifiData({ ...wifiData, ssid: e.target.value })} placeholder="Mi Red WiFi" />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Contraseña</label>
                                <input type="text" value={wifiData.password} onChange={(e) => setWifiData({ ...wifiData, password: e.target.value })} placeholder="********" />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Seguridad</label>
                                <select value={wifiData.encryption} onChange={(e) => setWifiData({ ...wifiData, encryption: e.target.value })}>
                                    <option value="WPA">WPA/WPA2</option>
                                    <option value="WEP">WEP</option>
                                    <option value="nopass">Sin Contraseña</option>
                                </select>
                            </div>
                        </div>
                    )}

                    {activeTab === 'vcard' && (
                        <div className="grid-2-cols">
                            <div className="form-group">
                                <label className="form-label">Nombre</label>
                                <input type="text" value={vcardData.firstName} onChange={(e) => setVcardData({ ...vcardData, firstName: e.target.value })} placeholder="Juan" />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Apellido</label>
                                <input type="text" value={vcardData.lastName} onChange={(e) => setVcardData({ ...vcardData, lastName: e.target.value })} placeholder="Pérez" />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Teléfono</label>
                                <input type="text" value={vcardData.phone} onChange={(e) => setVcardData({ ...vcardData, phone: e.target.value })} placeholder="+1 234 567 8900" />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Email</label>
                                <input type="text" value={vcardData.email} onChange={(e) => setVcardData({ ...vcardData, email: e.target.value })} placeholder="juan@ejemplo.com" />
                            </div>
                        </div>
                    )}

                    {activeTab === 'email' && (
                        <div className="grid-2-cols">
                            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                                <label className="form-label">Destinatario</label>
                                <input type="text" value={emailData.to} onChange={(e) => setEmailData({ ...emailData, to: e.target.value })} placeholder="contacto@empresa.com" />
                            </div>
                            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                                <label className="form-label">Asunto</label>
                                <input type="text" value={emailData.subject} onChange={(e) => setEmailData({ ...emailData, subject: e.target.value })} placeholder="Consulta de servicios" />
                            </div>
                        </div>
                    )}
                </div>

                <hr className="divider" />

                <h3 className="section-title"><Settings2 size={18} /> Apariencia Premium</h3>

                <div className="form-group color-group">
                    <div>
                        <label className="form-label">Color del QR</label>
                        <div className="color-picker-wrapper">
                            <input type="color" value={fgColor} onChange={(e) => setFgColor(e.target.value)} />
                            <span className="color-hex">{fgColor}</span>
                        </div>
                    </div>
                    <div>
                        <label className="form-label">Fondo</label>
                        <div className="color-picker-wrapper">
                            <input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} />
                            <span className="color-hex">{bgColor}</span>
                        </div>
                    </div>
                </div>

                <div className="grid-2-cols">
                    <div className="form-group">
                        <label className="form-label">Logo Central</label>
                        <div className="file-upload-wrapper">
                            <label className="btn btn-secondary upload-btn">
                                <ImageIcon size={16} /> Subir Imagen
                                <input type="file" accept="image/*" onChange={handleLogoUpload} style={{ display: 'none' }} />
                            </label>
                            {logoUrl && (
                                <button className="btn-icon" onClick={() => setLogoUrl('')} title="Quitar logo">
                                    <Trash2 size={16} color="var(--error-color)" />
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Calidad</label>
                        <select value={level} onChange={(e) => setLevel(e.target.value)}>
                            <option value="L">Normal</option>
                            <option value="M">Buena</option>
                            <option value="Q">Alta</option>
                            <option value="H">Máxima (Logo)</option>
                        </select>
                    </div>
                </div>

            </div>

            {/* Panel de Previsualización */}
            <div className="glass-panel qr-preview-container">
                <div className="qr-glow" style={{ backgroundColor: fgColor !== '#ffffff' && fgColor !== '#000000' ? fgColor : 'var(--accent-color)' }}></div>

                {qrValue ? (
                    <>
                        <div className="qr-wrapper" ref={qrRef} style={{ backgroundColor: bgColor }}>
                            {/* Usamos QRCodeSVG en lugar de Canvas para permitir la descarga vectorial perfecta */}
                            <QRCodeSVG
                                value={qrValue}
                                size={size}
                                level={logoUrl ? 'H' : level} // Forzar H si hay logo
                                bgColor={bgColor === 'transparent' ? '#ffffff' : bgColor}
                                fgColor={fgColor}
                                includeMargin={true}
                                imageSettings={logoUrl ? {
                                    src: logoUrl,
                                    x: undefined,
                                    y: undefined,
                                    height: size * 0.22, // 22% del tamaño
                                    width: size * 0.22,
                                    excavate: true, // Recorta el QR detrás del logo para que sea escaneable
                                } : undefined}
                            />
                            {/* Canvas oculto para exportar a PNG usando la misma config */}
                            <div style={{ display: 'none' }}>
                                <QRCodeCanvas
                                    value={qrValue}
                                    size={size * 2} // Alta resolución para PNG
                                    level={logoUrl ? 'H' : level}
                                    bgColor={bgColor}
                                    fgColor={fgColor}
                                    includeMargin={true}
                                    imageSettings={logoUrl ? {
                                        src: logoUrl, height: (size * 2) * 0.22, width: (size * 2) * 0.22, excavate: true,
                                    } : undefined}
                                />
                            </div>
                        </div>

                        <div className="download-section">
                            <div className="download-group">
                                <button className="btn btn-primary" onClick={handleDownloadPNG}>
                                    <Download size={18} /> PNG
                                </button>
                                <button className="btn btn-secondary" onClick={handleDownloadSVG} title="Vectores infinitamente escalables">
                                    SVG (Vector)
                                </button>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="empty-state">
                        <QrCode size={64} opacity={0.3} />
                        <p>Selecciona una plantilla y llena los datos para generar el QR.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
