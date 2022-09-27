using System;
using System.Collections;
using System.Net;
using System.Net.Sockets;
using System.Threading;

namespace wavesim_test
{
    public delegate void HandleRawPPIPkt(byte[] rxBuf, int len);

    public class WaveRadarPkt
    {
        public UInt64 counter = 0;                      // index 3,   size: 8 bytes, UInt64
        public UInt32 size      = 379;                  // index 11,  size: 4 bytes, Uint32, number of bytes in header
        public UInt32 data_size;                        // index 15,  size: 4 bytes, Uint32, number of bytes in data
        public Double RdrLat = 0;                       // index 19,  size: 8 bytes, double, radar latitude (deg)
        public Double RdrLon = 0;                       // index 27,  size: 8 bytes, double, radar longitude (deg)
        public Double RdrHgt = 0;                       // index 35,  size: 8 bytes, double, radar height (m)
        public Double RectRC = 0;                       // index 43,  size: 8 bytes, double, range to center of rectangle (m)
        public Double RectAC = 0;                       // index 51,  size: 8 bytes, double, PPI angle to center of rectangle (deg)
        public Double RectWidth = 0;                    // index 59,  size: 8 bytes, double, width of rectangle (m)
        public Double RectRgLn = 0;                     // index 67,  size: 8 bytes, double, Range length of rectangle (m)
        public Double Fp = 0;                           // index 75,  size: 8 bytes, double, Peak frequency (Hz) of the ID spectrum
        public Double Ep = 0;                           // index 83,  size: 8 bytes, double, Peak wave energy density (m * m / Hz) of the ID spectrum
        public Double M0 = 0;                           // index 91,  size: 8 bytes, double, Zero order moment (m*m) of the ID spectrum
        public Double Pwp1D = 0;                        // index 99,  size: 8 bytes, double, Peak period (s) of the 1D spectrum
        public Double HsPPI = 0;                        // index 107, size: 8 bytes, double, significant wave height (m) measured from PPI average power
        public Double HmaxPPI = 0;                      // index 115, size: 8 bytes, double, Max height (m) relative to HsPPI
        public Double HmeanPPI = 0;                     // index 123, size: 8 bytes, double, Mean height (m) relative to HsPPI
        public Double HmodePPI = 0;                     // index 131, size: 8 bytes, double, Mode height (m) relative to HsPPI
        public Double Hs3D_1  = 0;                      // index 139, size: 8 bytes, double, Significant wave height (m) measured from 3D spectrum energy of primary peak
        public Double Hmax3D = 0;                       // index 147, size: 8 bytes, double, Max height (m) relative to Hs3D_1
        public Double Hmean3D = 0;                      // index 155, size: 8 bytes, double, Mean height (m) relative to Hs3D_1
        public Double Hmode3D = 0;                      // index 163, size: 8 bytes, double, Mode height (m) relative to Hs3D_1
        public Double Hs3D_2 = 0;                       // index 171, size: 8 bytes, double, Wave height (m) of the secondary peak measured from the 3D spectrum
        public Double Hs3D_S = 0;                       // index 179, size: 8 bytes, double, Wave height (m) of the swell peak measured from the 3D spectrum
        public Double Pwp3D_1 = 0;                      // index 187, size: 8 bytes, double, Peak wave period (s) measured from the 3D spectrum primary peak
        public Double Tm02 = 0;                         // index 195, size: 8 bytes, double, Mean period (s) measured from the 3D spectrum primary peak
        public Double Tz = 0;                           // index 203, size: 8 bytes, double, Mean zero crossing period (s) measured from the 3D spectrum primary peak
        public Double T3 = 0;                           // index 211, size: 8 bytes, double, Mean 1/3 period (s) measured from the 3D spectrum primary peak
        public Double T10 = 0;                          // index 219, size: 8 bytes, double, Mean 1/10 period (s) measured from the 3D spectrum primary peak
        public Double Tmax = 0;                         // index 227, size: 8 bytes, double, Max period (s) measured from the 3D spectrum primary peak
        public Double Pwp3D_2 = 0;                      // index 235, size: 8 bytes, double, Wave period (s) measured from the 3D spectrum secondary peak
        public Double Pwp3D_S = 0;                      // index 243, size: 8 bytes, double, Wave period (s) measured from the 3D spectrum swell peak
        public Double Pwd3D_1 = 0;                      // index 251, size: 8 bytes, double, Wave direction (deg) measured from the 3D spectrum primary peak
        public Double Mdir = 0;                         // index 259, size: 8 bytes, double, Mean wave direction (deg)
        public Double Pwd3D_2 = 0;                      // index 267, size: 8 bytes, double, Wave direction (deg) measured from the 3D spectrum secondary peak
        public Double Pwd3D_S = 0;                      // index 275, size: 8 bytes, double, Wave direction (deg) measured from the 3D spectrum swell peak
        public Double Pwl3D_1 = 0;                      // index 283, size: 8 bytes, double, Peak wave length (m) measured from the 3D spectrum primary peak
        public Double MnLen3D = 0;                      // index 291, size: 8 bytes, double, Mean wave length (m) measured from the 3D spectrum primary peak
        public Double MxLen3D = 0;                      // index 299, size: 8 bytes, double, Max wave length (m) measured from the 3D spectrum primary peak
        public Double Pwl3D_2 = 0;                      // index 307, size: 8 bytes, double, Wave length (m) measured from the 3D spectrum secondary peak
        public Double Pwl3D_S = 0;                      // index 315, size: 8 bytes, double, Wave length (m) measured from the 3D spectrum swell peak
        public Double SCspeed = 0;                      // index 323, size: 8 bytes, double, Surface current speed (m/s)
        public Double SCdir = 0;                        // index 331, size: 8 bytes, double, Surface current direction (deg)
        public Double SCspread = 0;                     // index 339, size: 8 bytes, double, Directional spread (deg) of the surface current
        public Double TEDpeak = 0;                      // index 347, size: 8 bytes, double, Total energy direction, peak direction (deg)
        public Double TEDaverage = 0;                   // index 355, size: 8 bytes, double, Total energy direction, average direction (deg)
        public Double TEDenergy = 0;                    // index 363, size: 8 bytes, double, Total energy direction, total energy (J)
        public Double SNR = 0;                          // index 371, size: 8 bytes, double, Wave SNR (dB)

        /* index: 379, size: 4 * num_data, float
         * 1D Spectrum Array of floats containing 1D energy density spectrum
         */
        public float[] data;

        public WaveRadarPkt(int num_data)
        {
            this.size = 379;
            this.data_size = (UInt32)(num_data * 4);
            this.data = new float[num_data];
        }

        public WaveRadarPkt()
        {
            this.size = 379;
            this.data_size = 0;
            this.data = null;
        }

        public static WaveRadarPkt Decode(byte[] rxBuf, int rxLen)
        {
            //
            // minimum. 379 header + 3 byte tail.
            //
            if (rxLen < (379 + 3))
            {
                return null;
            }

            // MDS
            if (rxBuf[0] != 0x4d ||
                rxBuf[1] != 0x44 ||
                rxBuf[2] != 0x53)
            {
                Console.Write("Decode fail: MDS");
                return null;
            }

            WaveRadarPkt pkt = new WaveRadarPkt();

            pkt.counter = BitConverter.ToUInt64(rxBuf, 3);
            pkt.size = BitConverter.ToUInt32(rxBuf, 11);
            pkt.data_size = BitConverter.ToUInt32(rxBuf, 15);

            if ((379 + 3 + pkt.data_size) != rxLen)
            {
                Console.Write("Decode fail: invalid size");
                return null;
            }

            int offset = (int)(379 + pkt.data_size);

            // MDE
            if (rxBuf[offset + 0] != 0x4d ||
                rxBuf[offset + 1] != 0x44 ||
                rxBuf[offset + 2] != 0x45)
            {
                Console.Write("Decode fail: MDE");
                return null;
            }

            pkt.RdrLat = BitConverter.ToDouble(rxBuf, 19);      // index 19,  size: 8 bytes, double, radar latitude (deg)
            pkt.RdrLon = BitConverter.ToDouble(rxBuf, 27);      // index 27,  size: 8 bytes, double, radar longitude (deg)
            pkt.RdrHgt = BitConverter.ToDouble(rxBuf, 35);      // index 35,  size: 8 bytes, double, radar height (m)
            pkt.RectRC = BitConverter.ToDouble(rxBuf, 43);      // index 43,  size: 8 bytes, double, range to center of rectangle (m)
            pkt.RectAC = BitConverter.ToDouble(rxBuf, 51);      // index 51,  size: 8 bytes, double, PPI angle to center of rectangle (deg)
            pkt.RectWidth = BitConverter.ToDouble(rxBuf, 59);   // index 59,  size: 8 bytes, double, width of rectangle (m)
            pkt.RectRgLn = BitConverter.ToDouble(rxBuf, 67);    // index 67,  size: 8 bytes, double, Range length of rectangle (m)
            pkt.Fp = BitConverter.ToDouble(rxBuf, 75);          // index 75,  size: 8 bytes, double, Peak frequency (Hz) of the ID spectrum
            pkt.Ep = BitConverter.ToDouble(rxBuf, 83);          // index 83,  size: 8 bytes, double, Peak wave energy density (m * m / Hz) of the ID spectrum
            pkt.M0 = BitConverter.ToDouble(rxBuf, 91);          // index 91,  size: 8 bytes, double, Zero order moment (m*m) of the ID spectrum
            pkt.Pwp1D = BitConverter.ToDouble(rxBuf, 99);       // index 99,  size: 8 bytes, double, Peak period (s) of the 1D spectrum
            pkt.HsPPI = BitConverter.ToDouble(rxBuf, 107);      // index 107, size: 8 bytes, double, significant wave height (m) measured from PPI average power
            pkt.HmaxPPI = BitConverter.ToDouble(rxBuf, 115);    // index 115, size: 8 bytes, double, Max height (m) relative to HsPPI
            pkt.HmeanPPI = BitConverter.ToDouble(rxBuf, 123);   // index 123, size: 8 bytes, double, Mean height (m) relative to HsPPI
            pkt.HmodePPI = BitConverter.ToDouble(rxBuf, 131);   // index 131, size: 8 bytes, double, Mode height (m) relative to HsPPI
            pkt.Hs3D_1 = BitConverter.ToDouble(rxBuf, 139);     // index 139, size: 8 bytes, double, Significant wave height (m) measured from 3D spectrum energy of primary peak
            pkt.Hmax3D = BitConverter.ToDouble(rxBuf, 147);     // index 147, size: 8 bytes, double, Max height (m) relative to Hs3D_1
            pkt.Hmean3D = BitConverter.ToDouble(rxBuf, 155);    // index 155, size: 8 bytes, double, Mean height (m) relative to Hs3D_1
            pkt.Hmode3D = BitConverter.ToDouble(rxBuf, 163);    // index 163, size: 8 bytes, double, Mode height (m) relative to Hs3D_1
            pkt.Hs3D_2 = BitConverter.ToDouble(rxBuf, 171);     // index 171, size: 8 bytes, double, Wave height (m) of the secondary peak measured from the 3D spectrum
            pkt.Hs3D_S = BitConverter.ToDouble(rxBuf, 179);     // index 179, size: 8 bytes, double, Wave height (m) of the swell peak measured from the 3D spectrum
            pkt.Pwp3D_1 = BitConverter.ToDouble(rxBuf, 187);    // index 187, size: 8 bytes, double, Peak wave period (s) measured from the 3D spectrum primary peak
            pkt.Tm02 = BitConverter.ToDouble(rxBuf, 195);       // index 195, size: 8 bytes, double, Mean period (s) measured from the 3D spectrum primary peak
            pkt.Tz = BitConverter.ToDouble(rxBuf, 203);         // index 203, size: 8 bytes, double, Mean zero crossing period (s) measured from the 3D spectrum primary peak
            pkt.T3 = BitConverter.ToDouble(rxBuf, 211);         // index 211, size: 8 bytes, double, Mean 1/3 period (s) measured from the 3D spectrum primary peak
            pkt.T10 = BitConverter.ToDouble(rxBuf, 219);        // index 219, size: 8 bytes, double, Mean 1/10 period (s) measured from the 3D spectrum primary peak
            pkt.Tmax = BitConverter.ToDouble(rxBuf, 227);       // index 227, size: 8 bytes, double, Max period (s) measured from the 3D spectrum primary peak
            pkt.Pwp3D_2 = BitConverter.ToDouble(rxBuf, 235);    // index 235, size: 8 bytes, double, Wave period (s) measured from the 3D spectrum secondary peak
            pkt.Pwp3D_S = BitConverter.ToDouble(rxBuf, 243);    // index 243, size: 8 bytes, double, Wave period (s) measured from the 3D spectrum swell peak
            pkt.Pwd3D_1 = BitConverter.ToDouble(rxBuf, 251);    // index 251, size: 8 bytes, double, Wave direction (deg) measured from the 3D spectrum primary peak
            pkt.Mdir = BitConverter.ToDouble(rxBuf, 259);       // index 259, size: 8 bytes, double, Mean wave direction (deg)
            pkt.Pwd3D_2 = BitConverter.ToDouble(rxBuf, 267);    // index 267, size: 8 bytes, double, Wave direction (deg) measured from the 3D spectrum secondary peak
            pkt.Pwd3D_S = BitConverter.ToDouble(rxBuf, 275);    // index 275, size: 8 bytes, double, Wave direction (deg) measured from the 3D spectrum swell peak
            pkt.Pwl3D_1 = BitConverter.ToDouble(rxBuf, 283);    // index 283, size: 8 bytes, double, Peak wave length (m) measured from the 3D spectrum primary peak
            pkt.MnLen3D = BitConverter.ToDouble(rxBuf, 291);    // index 291, size: 8 bytes, double, Mean wave length (m) measured from the 3D spectrum primary peak
            pkt.MxLen3D = BitConverter.ToDouble(rxBuf, 299);    // index 299, size: 8 bytes, double, Max wave length (m) measured from the 3D spectrum primary peak
            pkt.Pwl3D_2 = BitConverter.ToDouble(rxBuf, 307);    // index 307, size: 8 bytes, double, Wave length (m) measured from the 3D spectrum secondary peak
            pkt.Pwl3D_S = BitConverter.ToDouble(rxBuf, 315);    // index 315, size: 8 bytes, double, Wave length (m) measured from the 3D spectrum swell peak
            pkt.SCspeed = BitConverter.ToDouble(rxBuf, 323);    // index 323, size: 8 bytes, double, Surface current speed (m/s)
            pkt.SCdir = BitConverter.ToDouble(rxBuf, 331);      // index 331, size: 8 bytes, double, Surface current direction (deg)
            pkt.SCspread = BitConverter.ToDouble(rxBuf, 339);   // index 339, size: 8 bytes, double, Directional spread (deg) of the surface current
            pkt.TEDpeak = BitConverter.ToDouble(rxBuf, 347);    // index 347, size: 8 bytes, double, Total energy direction, peak direction (deg)
            pkt.TEDaverage = BitConverter.ToDouble(rxBuf,355);  // index 355, size: 8 bytes, double, Total energy direction, average direction (deg)
            pkt.TEDenergy = BitConverter.ToDouble(rxBuf,363);   // index 363, size: 8 bytes, double, Total energy direction, total energy (J)
            pkt.SNR = BitConverter.ToDouble(rxBuf, 371);        // index 371, size: 8 bytes, double, Wave SNR (dB)

            int num_data = (int)(pkt.data_size / 4);
            offset = 379;

            pkt.data = new float[num_data];

            for(int i = 0; i < num_data; i++)
            {
                pkt.data[i] = BitConverter.ToSingle(rxBuf, offset);
                offset += 4;
            }

            return pkt;
        }
    }

    class WaveStreamReader
    {
        public enum WaveStreamReader_State
        {
            Reading_Header,
            Reading_Data,
            Reading_Tail,
        }

        private WaveStreamReader_State State { get; set; }
        private byte[] rxBytes;
        private int totalLen;
        private int currentTarget;
        private int currentRead;

        const int PPI_MAX_PKT_SIZE = 1024 * 3;

        public event HandleRawPPIPkt PPIRawPktReceived;

        public WaveStreamReader()
        {
            Reset();

            rxBytes = new byte[PPI_MAX_PKT_SIZE];
        }

        public void Reset()
        {
            State = WaveStreamReader_State.Reading_Header;

            totalLen = 0;
            currentTarget = 379;
            currentRead = 0;
        }

        public void Feed(byte[] buf, int len)
        {
            for (int i = 0; i < len; i++)
            {
                rxBytes[totalLen] = buf[i];
                totalLen++;
                currentRead++;

                if (currentRead == currentTarget)
                {
                    switch (State)
                    {
                        case WaveStreamReader_State.Reading_Header:
                            {
                                State = WaveStreamReader_State.Reading_Data;
                                currentRead = 0;
                                currentTarget = BitConverter.ToInt32(rxBytes, 15);
                                if (currentTarget == 0)
                                {
                                    State = WaveStreamReader_State.Reading_Tail;
                                    currentTarget = 3;
                                }
                            }
                            break;

                        case WaveStreamReader_State.Reading_Data:
                            {
                                State = WaveStreamReader_State.Reading_Tail;
                                currentRead = 0;
                                currentTarget = 3;
                            }
                            break;

                        case WaveStreamReader_State.Reading_Tail:
                            {
                                PPIRawPktReceived?.Invoke(rxBytes, totalLen);

                                State = WaveStreamReader_State.Reading_Header;
                                currentRead = 0;
                                currentTarget = 379;
                                totalLen = 0;
                            }
                            break;
                    }
                }
            }
        }
    }

    public class WaveTCPReceiver 
    {
        public enum WaveTCPReceiver_State
        {
            NOT_CONNECTED,
            CONNECTING,
            CONNECTED,
            WAITING_FOR_RECONNECT,
        }

        const int ppi_max_packet_size = 1024 * 3;


        private IPEndPoint serverEP;
        private WaveTCPReceiver_State tcpState;

        public WaveTCPReceiver(string ipaddress, int port)
        {
            serverEP = new IPEndPoint(IPAddress.Parse(ipaddress), port);
            tcpState = WaveTCPReceiver_State.NOT_CONNECTED;
        }

        private Socket createTCPClientSock()
        {
            Socket s;

            s = new Socket(AddressFamily.InterNetwork, SocketType.Stream, ProtocolType.Tcp);
            if (s == null)
            {
                Console.WriteLine("failed to create tcp client socket");
                return null;
            }

            //
            // we only use non-blocking socket
            // to prevent any intrusive code behavior
            //
            s.Blocking = false;

            return s;
        }

        private void MoveTCPState(WaveTCPReceiver_State newState)
        {
            Console.WriteLine("Movig TCP State {0} -> {1}", tcpState, newState);
            tcpState = newState;
        }

        private void HandlePPIRxPkt(byte[] rxBuf, int rxLen)
        {
            WaveRadarPkt pkt;

            pkt = WaveRadarPkt.Decode(rxBuf, rxLen);

            if (pkt != null)
            {
                Console.WriteLine("WaveRadarPacket Received");
                Console.WriteLine("Hs3D_1 {0}, Pwp3D_1 {1}, Pwd3D_1 {2}", pkt.Hs3D_1, pkt.Pwp3D_1, pkt.Pwd3D_1);
            }
            else
            {
                Console.WriteLine("WaveRadarPacket Received Invalid");
            }
        }

        public void WaveRx()
        {
            Socket s = null;
            ArrayList rList = new ArrayList(),
                      tList = new ArrayList(),
                      eList = new ArrayList();
            int rxLen;
            byte[] rxBuf = new byte[1024];
            WaveStreamReader reader = new WaveStreamReader();
            bool done = false;

            reader.PPIRawPktReceived += HandlePPIRxPkt;

            Console.WriteLine("PPIRX TCP Starting");
            MoveTCPState(WaveTCPReceiver_State.NOT_CONNECTED);

            while (!done)
            {
                rList.Clear();
                tList.Clear();
                eList.Clear();

                //
                // pre-select
                //
                switch (tcpState)
                {
                    case WaveTCPReceiver_State.NOT_CONNECTED:
                        s = createTCPClientSock();
                        if (s == null)
                        {
                            MoveTCPState(WaveTCPReceiver_State.WAITING_FOR_RECONNECT);
                        }
                        else
                        {
                            try
                            {
                                s.Connect((EndPoint)serverEP);
                            }
                            catch (SocketException se)
                            {
                                if (se.SocketErrorCode != SocketError.WouldBlock)
                                {
                                    Console.WriteLine("Connection attemp failed");
                                    s.Close();
                                    s = null;
                                    MoveTCPState(WaveTCPReceiver_State.WAITING_FOR_RECONNECT);
                                }
                                // ignore
                            }

                            if (s != null)
                            {
                                MoveTCPState(WaveTCPReceiver_State.CONNECTING);
                                tList.Add(s);
                                eList.Add(s);
                            }
                        }
                        break;

                    case WaveTCPReceiver_State.CONNECTING:
                        tList.Add(s);
                        eList.Add(s);
                        break;

                    case WaveTCPReceiver_State.CONNECTED:
                        rList.Add(s);
                        break;

                    default:
                        break;
                }

                if (tcpState == WaveTCPReceiver_State.WAITING_FOR_RECONNECT)
                {
                    int waitCount = 0;

                    while (waitCount < 20 && !done)
                    {
                        Thread.Sleep(100);
                        waitCount++;
                    }

                    MoveTCPState(WaveTCPReceiver_State.NOT_CONNECTED);
                    continue;
                }
                else
                {
                    Socket.Select(rList.Count != 0 ? rList : null,
                                  tList.Count != 0 ? tList : null,
                                  eList.Count != 0 ? eList : null,
                                  100);
                }

                //
                // post-select
                //
                switch (tcpState)
                {
                    case WaveTCPReceiver_State.CONNECTING:
                        if (tList.Count != 0)
                        {
                            if ((int)s.GetSocketOption(SocketOptionLevel.Socket, SocketOptionName.Error) == 0)
                            {
                                // connected
                                MoveTCPState(WaveTCPReceiver_State.CONNECTED);
                                reader.Reset();
                                Console.WriteLine("Connection established");
                            }
                            else
                            {
                                // failed to connect
                                s.Close();
                                s = null;
                                MoveTCPState(WaveTCPReceiver_State.WAITING_FOR_RECONNECT);
                            }
                        }
                        else if (eList.Count != 0)
                        {
                            s.Close();
                            s = null;
                            MoveTCPState(WaveTCPReceiver_State.WAITING_FOR_RECONNECT);
                        }
                        break;

                    case WaveTCPReceiver_State.CONNECTED:
                        if (rList.Count != 0)
                        {
                            // FIXME
                            // we got something to read
                            try
                            {
                                rxLen = s.Receive(rxBuf);

                                if (rxLen <= 0)
                                {
                                    Console.WriteLine("Socket Disconnected {0}", rxLen);
                                    s.Close();
                                    s = null;
                                    MoveTCPState(WaveTCPReceiver_State.WAITING_FOR_RECONNECT);
                                    Console.WriteLine("Connection disconnected");
                                }
                                else
                                {
                                    Console.WriteLine("read {0} bytes from stream", rxLen);
                                    reader.Feed(rxBuf, rxLen);
                                }
                            }
                            catch (Exception e)
                            {
                                Console.WriteLine("Socket Exception {0}", e);
                                s.Close();
                                s = null;
                                MoveTCPState(WaveTCPReceiver_State.WAITING_FOR_RECONNECT);
                                Console.WriteLine("Connection disconnected");
                            }
                        }
                        break;

                    default:
                        break;
                }
            }

            if (s != null)
            {
                s.Close();
            }
        }
    }

    public class WaveUDPReceiver
    {
        private int udp_port;
        const int ppi_max_packet_size = 1024 * 3;       // 3K should be enough

        public WaveUDPReceiver(int port)
        {
            udp_port = port;
        }

        public WaveUDPReceiver() : this(8905)
        {
        }

        public void WaveRx()
        {
            Console.WriteLine("PPIRx Starting");

            Socket s = null;
            IPEndPoint ipe = new IPEndPoint(IPAddress.Any, udp_port);

            s = new Socket(AddressFamily.InterNetwork, SocketType.Dgram, ProtocolType.Udp);
            s.Bind(ipe);

            Console.WriteLine("PPIRx Created Socket and bound to {0}", udp_port);

            ArrayList rxList = new ArrayList();
            int rxLen;
            Byte[] rxBuf = new byte[ppi_max_packet_size];
            IPEndPoint sender = new IPEndPoint(IPAddress.Any, 0);
            EndPoint from = (EndPoint)sender;
            bool done = false;

            Console.WriteLine("PPIRx Entering MainLoop");

            while (!done)
            {
                rxList.Add(s);

                Socket.Select(rxList, null, null, 100);

                if (rxList.Count == 0)
                {
                    continue;
                }

                rxLen = s.ReceiveFrom(rxBuf, ref from);

                if (rxLen <= 0)
                {
                    Console.WriteLine("PPIRx ReceiveFrom invalid Length {0}", rxLen);
                    continue;
                }

                Console.WriteLine("PPIRx Received {0} bytes from {1}", rxLen, from.ToString());

                WaveRadarPkt pkt;

                pkt = WaveRadarPkt.Decode(rxBuf, rxLen);

                if (pkt != null)
                {
                    Console.WriteLine("WaveRadarPacket Received");
                    Console.WriteLine("Hs3D_1 {0}, Pwp3D_1 {1}, Pwd3D_1 {2}", pkt.Hs3D_1, pkt.Pwp3D_1, pkt.Pwd3D_1);
                }
                else
                {
                    Console.WriteLine("WaveRadarPacket Received Invalid");
                }
            }

            if (s != null)
            {
                s.Close();
                s = null;
            }
        }
    }

    internal class Program
    {
        static void Main(string[] args)
        {
            if (args.Length < 1)
            {
                goto command_error;
            }

            string target = args[0];
            string ip;
            int port;

            if (target == "tcp")
            {
                if (args.Length != 3)
                {
                    goto command_error;
                }

                ip = args[1];
                try
                {
                    port = int.Parse(args[2]);
                }
                catch
                {
                    goto command_error;
                }

                WaveTCPReceiver receiver = new WaveTCPReceiver(ip, port);
                receiver.WaveRx();
            }
            else if (target == "udp")
            {
                if (args.Length != 2)
                {
                    goto command_error;
                }

                try
                {
                    port = int.Parse(args[1]);
                }
                catch
                {
                    goto command_error;
                }
                WaveUDPReceiver receiver;


                receiver = new WaveUDPReceiver(port);

                receiver.WaveRx();
            }
            else
            {
                goto command_error;
            }

            return;

        command_error:
            Console.WriteLine("Command Line Error");
            Console.WriteLine("wavesim_test.exe tcp <ip> <port>");
            Console.WriteLine("wavesim_test.exe udp  <port>");
        }
    }
}
