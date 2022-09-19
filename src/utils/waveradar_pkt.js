const arrayBufferToBuffer = require('arraybuffer-to-buffer');

var WaveRadar_Pkt = function(num_data)
{
  this.header = {};
  this.header.counter   = 0;              // index 3,   size: 8 bytes, UInt64
  this.header.size      = 379;            // index 11,  size: 4 bytes, Uint32, number of bytes in header
  this.header.data_size = num_data * 4;   // index 15,  size: 4 bytes, Uint32, number of bytes in data
  this.header.RdrLat = 0;                 // index 19,  size: 8 bytes, double, radar latitude (deg)
  this.header.RdrLon = 0;                 // index 27,  size: 8 bytes, double, radar longitude (deg)
  this.header.RdrHgt = 0;                 // index 35,  size: 8 bytes, double, radar height (m)
  this.header.RectRC = 0;                 // index 43,  size: 8 bytes, double, range to center of rectangle (m)
  this.header.RectAC = 0;                 // index 51,  size: 8 bytes, double, PPI angle to center of rectangle (deg)
  this.header.RectWidth = 0;              // index 59,  size: 8 bytes, double, width of rectangle (m)
  this.header.RectRgLn = 0;               // index 67,  size: 8 bytes, double, Range length of rectangle (m)
  this.header.Fp = 0;                     // index 75,  size: 8 bytes, double, Peak frequency (Hz) of the ID spectrum
  this.header.Ep = 0;                     // index 83,  size: 8 bytes, double, Peak wave energy density (m * m / Hz) of the ID spectrum
  this.header.M0 = 0;                     // index 91,  size: 8 bytes, double, Zero order moment (m*m) of the ID spectrum
  this.header.Pwp1D = 0;                  // index 99,  size: 8 bytes, double, Peak period (s) of the 1D spectrum
  this.header.HsPPI = 0;                  // index 107, size: 8 bytes, double, significant wave height (m) measured from PPI average power
  this.header.HmaxPPI = 0;                // index 115, size: 8 bytes, double, Max height (m) relative to HsPPI
  this.header.HmeanPPI = 0;               // index 123, size: 8 bytes, double, Mean height (m) relative to HsPPI
  this.header.HmodePPI = 0;               // index 131, size: 8 bytes, double, Mode height (m) relative to HsPPI
  this.header.Hs3D_1  = 0;                // index 139, size: 8 bytes, double, Significant wave height (m) measured from 3D spectrum energy of primary peak
  this.header.Hmax3D = 0;                 // index 147, size: 8 bytes, double, Max height (m) relative to Hs3D_1
  this.header.Hmean3D = 0;                // index 155, size: 8 bytes, double, Mean height (m) relative to Hs3D_1
  this.header.Hmode3D = 0;                // index 163, size: 8 bytes, double, Mode height (m) relative to Hs3D_1
  this.header.Hs3D_2 = 0;                 // index 171, size: 8 bytes, double, Wave height (m) of the secondary peak measured from the 3D spectrum
  this.header.Hs3D_S = 0;                 // index 179, size: 8 bytes, double, Wave height (m) of the swell peak measured from the 3D spectrum
  this.header.Pwp3D_1 = 0;                // index 187, size: 8 bytes, double, Peak wave period (s) measured from the 3D spectrum primary peak
  this.header.Tm02 = 0;                   // index 195, size: 8 bytes, double, Mean period (s) measured from the 3D spectrum primary peak
  this.header.Tz = 0;                     // index 203, size: 8 bytes, double, Mean zero crossing period (s) measured from the 3D spectrum primary peak
  this.header.T3 = 0;                     // index 211, size: 8 bytes, double, Mean 1/3 period (s) measured from the 3D spectrum primary peak
  this.header.T10 = 0;                    // index 219, size: 8 bytes, double, Mean 1/10 period (s) measured from the 3D spectrum primary peak
  this.header.Tmax = 0;                   // index 227, size: 8 bytes, double, Max period (s) measured from the 3D spectrum primary peak
  this.header.Pwp3D_2 = 0;                // index 235, size: 8 bytes, double, Wave period (s) measured from the 3D spectrum secondary peak
  this.header.Pwp3D_S = 0;                // index 243, size: 8 bytes, double, Wave period (s) measured from the 3D spectrum swell peak
  this.header.Pwd3D_1 = 0;                // index 251, size: 8 bytes, double, Wave direction (deg) measured from the 3D spectrum primary peak
  this.header.Mdir = 0;                   // index 259, size: 8 bytes, double, Mean wave direction (deg)
  this.header.Pwd3D_2 = 0;                // index 267, size: 8 bytes, double, Wave direction (deg) measured from the 3D spectrum secondary peak
  this.header.Pwd3D_S = 0;                // index 275, size: 8 bytes, double, Wave direction (deg) measured from the 3D spectrum swell peak
  this.header.Pwl3D_1 = 0;                // index 283, size: 8 bytes, double, Peak wave length (m) measured from the 3D spectrum primary peak
  this.header.MnLen3D = 0;                // index 291, size: 8 bytes, double, Mean wave length (m) measured from the 3D spectrum primary peak
  this.header.MxLen3D = 0;                // index 299, size: 8 bytes, double, Max wave length (m) measured from the 3D spectrum primary peak
  this.header.Pwl3D_2 = 0;                // index 307, size: 8 bytes, double, Wave length (m) measured from the 3D spectrum secondary peak
  this.header.Pwl3D_S = 0;                // index 315, size: 8 bytes, double, Wave length (m) measured from the 3D spectrum swell peak
  this.header.SCspeed = 0;                // index 323, size: 8 bytes, double, Surface current speed (m/s)
  this.header.SCdir = 0;                  // index 331, size: 8 bytes, double, Surface current direction (deg)
  this.header.SCspread = 0;               // index 339, size: 8 bytes, double, Directional spread (deg) of the surface current
  this.header.TEDpeak = 0;                // index 347, size: 8 bytes, double, Total energy direction, peak direction (deg)
  this.header.TEDaverage = 0;             // index 355, size: 8 bytes, double, Total energy direction, average direction (deg)
  this.header.TEDenergy = 0;              // index 363, size: 8 bytes, double, Total energy direction, total energy (J)
  this.header.SNR = 0;                    // index 371, size: 8 bytes, double, Wave SNR (dB)

  /* index: 379, size: 4 * num_data, float
  1D Spectrum Array of floats containing 1D energy density spectrum
  */
  this.data = new Array(num_data);
  this.data.fill(0);
}

WaveRadar_Pkt.prototype.encode = function()
{
  const size = 379 + 3 + this.data.length * 4;
  const buffer = new ArrayBuffer(size);
  const view = new DataView(buffer);
  const littleEndian = true;

  // XXX: little endian

  // 'MDS'
  view.setUint8(0, 0x4d);
  view.setUint8(1, 0x44);
  view.setUint8(2, 0x53);

  //view.setBigUint64(3, this.header.counter, littleEndian);          // index 3,   size: 8 bytes, UInt64
  // eslint-disable-next-line
  view.setBigUint64(3, BigInt(this.header.counter), littleEndian);  // index 3,   size: 8 bytes, UInt64

  view.setUint32(11, this.header.size, littleEndian);               // index 11,  size: 4 bytes, Uint32, number of bytes in header
  view.setUint32(15, this.header.data_size, littleEndian);          // index 15,  size: 4 bytes, Uint32, number of bytes in data

  view.setFloat64(19, this.header.RdrLat, littleEndian);            // index 19,  size: 8 bytes, double, radar latitude (deg)
  view.setFloat64(27, this.header.RdrLon, littleEndian);            // index 27,  size: 8 bytes, double, radar longitude (deg)
  view.setFloat64(35, this.header.RdrHgt, littleEndian);            // index 35,  size: 8 bytes, double, radar height (m)
  view.setFloat64(43, this.header.RectRC, littleEndian);            // index 43,  size: 8 bytes, double, range to center of rectangle (m)
  view.setFloat64(51, this.header.RectAC, littleEndian);            // index 51,  size: 8 bytes, double, PPI angle to center of rectangle (deg)
  view.setFloat64(59, this.header.RectWidth, littleEndian);         // index 59,  size: 8 bytes, double, width of rectangle (m)
  view.setFloat64(67, this.header.RectRgLn, littleEndian);          // index 67,  size: 8 bytes, double, Range length of rectangle (m)
  view.setFloat64(75, this.header.Fp, littleEndian);                // index 75,  size: 8 bytes, double, Peak frequency (Hz) of the ID spectrum
  view.setFloat64(83, this.header.Ep, littleEndian);                // index 83,  size: 8 bytes, double, Peak wave energy density (m * m / Hz) of the ID spectrum
  view.setFloat64(91, this.header.M0, littleEndian);                // index 91,  size: 8 bytes, double, Zero order moment (m*m) of the ID spectrum
  view.setFloat64(99, this.header.Pwp1D, littleEndian);             // index 99,  size: 8 bytes, double, Peak period (s) of the 1D spectrum
  view.setFloat64(107, this.header.HsPPI, littleEndian);            // index 107, size: 8 bytes, double, significant wave height (m) measured from PPI average power
  view.setFloat64(115, this.header.HmaxPPI, littleEndian);          // index 115, size: 8 bytes, double, Max height (m) relative to HsPPI
  view.setFloat64(123, this.header.HmeanPPI, littleEndian);         // index 123, size: 8 bytes, double, Mean height (m) relative to HsPPI
  view.setFloat64(131, this.header.HmodePPI, littleEndian);         // index 131, size: 8 bytes, double, Mode height (m) relative to HsPPI
  view.setFloat64(139, this.header.Hs3D_1, littleEndian);           // index 139, size: 8 bytes, double, Significant wave height (m) measured from 3D spectrum energy of primary peak
  view.setFloat64(147, this.header.Hmax3D, littleEndian);           // index 147, size: 8 bytes, double, Max height (m) relative to Hs3D_1
  view.setFloat64(155, this.header.Hmean3D, littleEndian);          // index 155, size: 8 bytes, double, Mean height (m) relative to Hs3D_1
  view.setFloat64(163, this.header.Hmode3D, littleEndian);          // index 163, size: 8 bytes, double, Mode height (m) relative to Hs3D_1
  view.setFloat64(171, this.header.Hs3D_2, littleEndian);           // index 171, size: 8 bytes, double, Wave height (m) of the secondary peak measured from the 3D spectrum
  view.setFloat64(179, this.header.Hs3D_S, littleEndian);           // index 179, size: 8 bytes, double, Wave height (m) of the swell peak measured from the 3D spectrum
  view.setFloat64(187, this.header.Pwp3D_1, littleEndian);          // index 187, size: 8 bytes, double, Peak wave period (s) measured from the 3D spectrum primary peak
  view.setFloat64(195, this.header.Tm02, littleEndian);             // index 195, size: 8 bytes, double, Mean period (s) measured from the 3D spectrum primary peak
  view.setFloat64(203, this.header.Tz, littleEndian);               // index 203, size: 8 bytes, double, Mean zero crossing period (s) measured from the 3D spectrum primary peak
  view.setFloat64(211, this.header.T3, littleEndian);               // index 211, size: 8 bytes, double, Mean 1/3 period (s) measured from the 3D spectrum primary peak
  view.setFloat64(219, this.header.T10, littleEndian);              // index 219, size: 8 bytes, double, Mean 1/10 period (s) measured from the 3D spectrum primary peak
  view.setFloat64(227, this.header.Tmax, littleEndian);             // index 227, size: 8 bytes, double, Max period (s) measured from the 3D spectrum primary peak
  view.setFloat64(235, this.header.Pwp3D_2, littleEndian);          // index 235, size: 8 bytes, double, Wave period (s) measured from the 3D spectrum secondary peak
  view.setFloat64(243, this.header.Pwp3D_S, littleEndian);          // index 243, size: 8 bytes, double, Wave period (s) measured from the 3D spectrum swell peak
  view.setFloat64(251, this.header.Pwd3D_1, littleEndian);          // index 251, size: 8 bytes, double, Wave direction (deg) measured from the 3D spectrum primary peak
  view.setFloat64(259, this.header.Mdir, littleEndian);             // index 259, size: 8 bytes, double, Mean wave direction (deg)
  view.setFloat64(267, this.header.Pwd3D_2, littleEndian);          // index 267, size: 8 bytes, double, Wave direction (deg) measured from the 3D spectrum secondary peak
  view.setFloat64(275, this.header.Pwd3D_S, littleEndian);          // index 275, size: 8 bytes, double, Wave direction (deg) measured from the 3D spectrum swell peak
  view.setFloat64(283, this.header.Pwl3D_1, littleEndian);          // index 283, size: 8 bytes, double, Peak wave length (m) measured from the 3D spectrum primary peak
  view.setFloat64(291, this.header.MnLen3D, littleEndian);          // index 291, size: 8 bytes, double, Mean wave length (m) measured from the 3D spectrum primary peak
  view.setFloat64(299, this.header.MxLen3D, littleEndian);          // index 299, size: 8 bytes, double, Max wave length (m) measured from the 3D spectrum primary peak
  view.setFloat64(307, this.header.Pwl3D_2, littleEndian);          // index 307, size: 8 bytes, double, Wave length (m) measured from the 3D spectrum secondary peak
  view.setFloat64(315, this.header.Pwl3D_S, littleEndian);          // index 315, size: 8 bytes, double, Wave length (m) measured from the 3D spectrum swell peak
  view.setFloat64(323, this.header.SCspeed, littleEndian);          // index 323, size: 8 bytes, double, Surface current speed (m/s)
  view.setFloat64(331, this.header.SCdir, littleEndian);            // index 331, size: 8 bytes, double, Surface current direction (deg)
  view.setFloat64(339, this.header.SCspread, littleEndian);         // index 339, size: 8 bytes, double, Directional spread (deg) of the surface current
  view.setFloat64(347, this.header.TEDpeak, littleEndian);          // index 347, size: 8 bytes, double, Total energy direction, peak direction (deg)
  view.setFloat64(355, this.header.TEDaverage, littleEndian);       // index 355, size: 8 bytes, double, Total energy direction, average direction (deg)
  view.setFloat64(363, this.header.TEDenergy, littleEndian);        // index 363, size: 8 bytes, double, Total energy direction, total energy (J)
  view.setFloat64(371, this.header.SNR, littleEndian);              // index 371, size: 8 bytes, double, Wave SNR (dB)

  let ndx = 379;

  this.data.forEach((e) => {
    view.setFloat32(ndx, e, littleEndian);
    ndx = ndx + 4;
  });

  // 'MDE'
  view.setUint8(ndx + 0, 0x4d);
  view.setUint8(ndx + 1, 0x44);
  view.setUint8(ndx + 2, 0x45);

  return arrayBufferToBuffer(buffer);
}

module.exports = WaveRadar_Pkt;
