"use client";

/**
 * Renders a study chapter from data (lib/study/schema.ts). Uses the full width (owner, 18 Nov): each topic is laid out
 * in rows: hook beside objectives, idea beside definition, method beside its figure, every worked example beside its own
 * figures, traps in a row, GATE note beside recall cards, questions two across. Blocks use the app's pastel card system
 * (one tint per block kind) so lessons look like the rest of RENYXERA in light and dark.
 * Second pass (owner, 18 Nov): one screen on desktop. The outline on the left and the lesson each scroll on their own;
 * the outline lists every section of the topic, jumps to it and follows your place. Notes, PYQs and the Mentor are
 * floating tools (lesson-tools.tsx), so the lesson gets the whole remaining width.
 */
import dynamic from "next/dynamic";
/* Labs load on demand (bundle budget, 18 Nov): each lab module is its own chunk. */
const Dm3SpanningLab = dynamic(() => import("@/components/study/dm-labs-3").then((m) => m.SpanningLab), { ssr: false });
const Dm3PlanarLab = dynamic(() => import("@/components/study/dm-labs-3").then((m) => m.PlanarLab), { ssr: false });
const Dm3HallLab = dynamic(() => import("@/components/study/dm-labs-3").then((m) => m.HallLab), { ssr: false });
const Dm3IsoLab = dynamic(() => import("@/components/study/dm-labs-3").then((m) => m.IsoLab), { ssr: false });
const Dm3PigeonLab = dynamic(() => import("@/components/study/dm-labs-3").then((m) => m.PigeonLab), { ssr: false });
const Dm3PascalLab = dynamic(() => import("@/components/study/dm-labs-3").then((m) => m.PascalLab), { ssr: false });
const Dm3MasterLab = dynamic(() => import("@/components/study/dm-labs-3").then((m) => m.MasterLab), { ssr: false });

const Dm2ArgumentLab = dynamic(() => import("@/components/study/dm-labs-2").then((m) => m.ArgumentLab), { ssr: false });
const Dm2CompleteLab = dynamic(() => import("@/components/study/dm-labs-2").then((m) => m.CompleteLab), { ssr: false });
const Dm2TranslateLab = dynamic(() => import("@/components/study/dm-labs-2").then((m) => m.TranslateLab), { ssr: false });
const Dm2SetLab = dynamic(() => import("@/components/study/dm-labs-2").then((m) => m.SetLab), { ssr: false });
const Dm2ComposeLab = dynamic(() => import("@/components/study/dm-labs-2").then((m) => m.ComposeLab), { ssr: false });
const Dm2AtomLab = dynamic(() => import("@/components/study/dm-labs-2").then((m) => m.AtomLab), { ssr: false });
const Dm2CosetLab = dynamic(() => import("@/components/study/dm-labs-2").then((m) => m.CosetLab), { ssr: false });

const DbErLab = dynamic(() => import("@/components/study/db-labs").then((m) => m.ErLab), { ssr: false });
const DbErExtraLab = dynamic(() => import("@/components/study/db-labs").then((m) => m.ErExtraLab), { ssr: false });
const DbKeysLab = dynamic(() => import("@/components/study/db-labs").then((m) => m.KeysLab), { ssr: false });
const DbFkLab = dynamic(() => import("@/components/study/db-labs").then((m) => m.FkLab), { ssr: false });
const DbRaLab = dynamic(() => import("@/components/study/db-labs").then((m) => m.RaLab), { ssr: false });
const DbTrcLab = dynamic(() => import("@/components/study/db-labs").then((m) => m.TrcLab), { ssr: false });
const DbSqlLab = dynamic(() => import("@/components/study/db-labs").then((m) => m.SqlLab), { ssr: false });
const DbSqlNestedLab = dynamic(() => import("@/components/study/db-labs").then((m) => m.SqlNestedLab), { ssr: false });
const DbFdLab = dynamic(() => import("@/components/study/db-labs").then((m) => m.FdLab), { ssr: false });
const DbNfLab = dynamic(() => import("@/components/study/db-labs").then((m) => m.NfLab), { ssr: false });
const DbIndexLab = dynamic(() => import("@/components/study/db-labs").then((m) => m.IndexLab), { ssr: false });
const DbBtreeLab = dynamic(() => import("@/components/study/db-labs").then((m) => m.BtreeLab), { ssr: false });
const DbSerialLab = dynamic(() => import("@/components/study/db-labs").then((m) => m.SerialLab), { ssr: false });
const DbRecoverLab = dynamic(() => import("@/components/study/db-labs").then((m) => m.RecoverLab), { ssr: false });
const DbTwoPlLab = dynamic(() => import("@/components/study/db-labs").then((m) => m.TwoPlLab), { ssr: false });
const DbTsLab = dynamic(() => import("@/components/study/db-labs").then((m) => m.TsLab), { ssr: false });
const Db2EerLab = dynamic(() => import("@/components/study/db-labs-2").then((m) => m.EerLab), { ssr: false });
const Db2OuterLab = dynamic(() => import("@/components/study/db-labs-2").then((m) => m.OuterLab), { ssr: false });
const Db2GroupLab = dynamic(() => import("@/components/study/db-labs-2").then((m) => m.GroupLab), { ssr: false });
const Db2NullLab = dynamic(() => import("@/components/study/db-labs-2").then((m) => m.NullLab), { ssr: false });
const Db2DecompLab = dynamic(() => import("@/components/study/db-labs-2").then((m) => m.DecompLab), { ssr: false });
const Db2MvdLab = dynamic(() => import("@/components/study/db-labs-2").then((m) => m.MvdLab), { ssr: false });
const Db2HashLab = dynamic(() => import("@/components/study/db-labs-2").then((m) => m.HashLab), { ssr: false });
const Db2LogLab = dynamic(() => import("@/components/study/db-labs-2").then((m) => m.LogLab), { ssr: false });
const Db2MglLab = dynamic(() => import("@/components/study/db-labs-2").then((m) => m.MglLab), { ssr: false });
const Db2ValidateLab = dynamic(() => import("@/components/study/db-labs-2").then((m) => m.ValidateLab), { ssr: false });
const Os2CtxLab = dynamic(() => import("@/components/study/os-labs-2").then((m) => m.CtxLab), { ssr: false });
const Os2ZombieLab = dynamic(() => import("@/components/study/os-labs-2").then((m) => m.ZombieLab), { ssr: false });
const Os2RtLab = dynamic(() => import("@/components/study/os-labs-2").then((m) => m.RtLab), { ssr: false });
const Os2PvLab = dynamic(() => import("@/components/study/os-labs-2").then((m) => m.PvLab), { ssr: false });
const Os2MonitorLab = dynamic(() => import("@/components/study/os-labs-2").then((m) => m.MonitorLab), { ssr: false });
const Os2RwLab = dynamic(() => import("@/components/study/os-labs-2").then((m) => m.RwLab), { ssr: false });
const Os2DineLab = dynamic(() => import("@/components/study/os-labs-2").then((m) => m.DineLab), { ssr: false });
const Os2PtSizeLab = dynamic(() => import("@/components/study/os-labs-2").then((m) => m.PtSizeLab), { ssr: false });
const Os2BuddyLab = dynamic(() => import("@/components/study/os-labs-2").then((m) => m.BuddyLab), { ssr: false });
const Os2ClockLab = dynamic(() => import("@/components/study/os-labs-2").then((m) => m.ClockLab), { ssr: false });
const Os2CowLab = dynamic(() => import("@/components/study/os-labs-2").then((m) => m.CowLab), { ssr: false });
const Os2FsLinksLab = dynamic(() => import("@/components/study/os-labs-2").then((m) => m.FsLinksLab), { ssr: false });
const Os2FreeSpaceLab = dynamic(() => import("@/components/study/os-labs-2").then((m) => m.FreeSpaceLab), { ssr: false });
const Os2DiskTimeLab = dynamic(() => import("@/components/study/os-labs-2").then((m) => m.DiskTimeLab), { ssr: false });
const Os2RaidLab = dynamic(() => import("@/components/study/os-labs-2").then((m) => m.RaidLab), { ssr: false });
const Os2DmaLab = dynamic(() => import("@/components/study/os-labs-2").then((m) => m.DmaLab), { ssr: false });
const Cn2PerfLab = dynamic(() => import("@/components/study/cn-labs-2").then((m) => m.PerfLab), { ssr: false });
const Cn2HammingLab = dynamic(() => import("@/components/study/cn-labs-2").then((m) => m.HammingLab), { ssr: false });
const Cn2BridgeLab = dynamic(() => import("@/components/study/cn-labs-2").then((m) => m.BridgeLab), { ssr: false });
const Cn2CsmaCaLab = dynamic(() => import("@/components/study/cn-labs-2").then((m) => m.CsmaCaLab), { ssr: false });
const Cn2NatLab = dynamic(() => import("@/components/study/cn-labs-2").then((m) => m.NatLab), { ssr: false });
const Cn2Ipv6Lab = dynamic(() => import("@/components/study/cn-labs-2").then((m) => m.Ipv6Lab), { ssr: false });
const Cn2ClassfulLab = dynamic(() => import("@/components/study/cn-labs-2").then((m) => m.ClassfulLab), { ssr: false });
const Cn2RwndLab = dynamic(() => import("@/components/study/cn-labs-2").then((m) => m.RwndLab), { ssr: false });
const Cn2RtoLab = dynamic(() => import("@/components/study/cn-labs-2").then((m) => m.RtoLab), { ssr: false });
const Cn2ChecksumLab = dynamic(() => import("@/components/study/cn-labs-2").then((m) => m.ChecksumLab), { ssr: false });
const Cn2DnsLab = dynamic(() => import("@/components/study/cn-labs-2").then((m) => m.DnsLab), { ssr: false });
const Cn2Base64Lab = dynamic(() => import("@/components/study/cn-labs-2").then((m) => m.Base64Lab), { ssr: false });
const Cn2WebCacheLab = dynamic(() => import("@/components/study/cn-labs-2").then((m) => m.WebCacheLab), { ssr: false });
const PdsCTypesLab = dynamic(() => import("@/components/study/pds-labs").then((m) => m.CTypesLab), { ssr: false });
const PdsLoopLab = dynamic(() => import("@/components/study/pds-labs").then((m) => m.LoopLab), { ssr: false });
const PdsPtrLab = dynamic(() => import("@/components/study/pds-labs").then((m) => m.PtrLab), { ssr: false });
const PdsParamLab = dynamic(() => import("@/components/study/pds-labs").then((m) => m.ParamLab), { ssr: false });
const PdsStructLab = dynamic(() => import("@/components/study/pds-labs").then((m) => m.StructLab), { ssr: false });
const PdsRecTraceLab = dynamic(() => import("@/components/study/pds-labs").then((m) => m.RecTraceLab), { ssr: false });
const PdsFibCallsLab = dynamic(() => import("@/components/study/pds-labs").then((m) => m.FibCallsLab), { ssr: false });
const PdsHanoiLab = dynamic(() => import("@/components/study/pds-labs").then((m) => m.HanoiLab), { ssr: false });
const PdsAddrLab = dynamic(() => import("@/components/study/pds-labs").then((m) => m.AddrLab), { ssr: false });
const PdsTriLab = dynamic(() => import("@/components/study/pds-labs").then((m) => m.TriLab), { ssr: false });
const PdsBsearchLab = dynamic(() => import("@/components/study/pds-labs").then((m) => m.BsearchLab), { ssr: false });
const PdsStackPermLab = dynamic(() => import("@/components/study/pds-labs").then((m) => m.StackPermLab), { ssr: false });
const PdsPostfixLab = dynamic(() => import("@/components/study/pds-labs").then((m) => m.PostfixLab), { ssr: false });
const PdsCQueueLab = dynamic(() => import("@/components/study/pds-labs").then((m) => m.CQueueLab), { ssr: false });
const PdsTwoStackLab = dynamic(() => import("@/components/study/pds-labs").then((m) => m.TwoStackLab), { ssr: false });
const PdsLListLab = dynamic(() => import("@/components/study/pds-labs").then((m) => m.LListLab), { ssr: false });
const PdsJosephusLab = dynamic(() => import("@/components/study/pds-labs").then((m) => m.JosephusLab), { ssr: false });
const PdsFloydLab = dynamic(() => import("@/components/study/pds-labs").then((m) => m.FloydLab), { ssr: false });
const PdsTreePropsLab = dynamic(() => import("@/components/study/pds-labs").then((m) => m.TreePropsLab), { ssr: false });
const PdsTraverseLab = dynamic(() => import("@/components/study/pds-labs").then((m) => m.TraverseLab), { ssr: false });
const PdsBstLab = dynamic(() => import("@/components/study/pds-labs").then((m) => m.BstLab), { ssr: false });
const PdsAvlLab = dynamic(() => import("@/components/study/pds-labs").then((m) => m.AvlLab), { ssr: false });
const PdsHeapLab = dynamic(() => import("@/components/study/pds-labs").then((m) => m.HeapLab), { ssr: false });
const PdsHeapsortLab = dynamic(() => import("@/components/study/pds-labs").then((m) => m.HeapsortLab), { ssr: false });
const PdsDaryLab = dynamic(() => import("@/components/study/pds-labs").then((m) => m.DaryLab), { ssr: false });
const PdsGraphRepLab = dynamic(() => import("@/components/study/pds-labs").then((m) => m.GraphRepLab), { ssr: false });
const PdsBfsDfsLab = dynamic(() => import("@/components/study/pds-labs").then((m) => m.BfsDfsLab), { ssr: false });
const PdsGraphOpsLab = dynamic(() => import("@/components/study/pds-labs").then((m) => m.GraphOpsLab), { ssr: false });
const AlgoGrowthLab = dynamic(() => import("@/components/study/algo-labs").then((m) => m.GrowthLab), { ssr: false });
const AlgoRecTreeLab = dynamic(() => import("@/components/study/algo-labs").then((m) => m.RecTreeLab), { ssr: false });
const AlgoMasterLab2 = dynamic(() => import("@/components/study/algo-labs").then((m) => m.MasterLab2), { ssr: false });
const AlgoElemSortLab = dynamic(() => import("@/components/study/algo-labs").then((m) => m.ElemSortLab), { ssr: false });
const AlgoMergeLab = dynamic(() => import("@/components/study/algo-labs").then((m) => m.MergeLab), { ssr: false });
const AlgoQuickLab = dynamic(() => import("@/components/study/algo-labs").then((m) => m.QuickLab), { ssr: false });
const AlgoSortCmpLab = dynamic(() => import("@/components/study/algo-labs").then((m) => m.SortCmpLab), { ssr: false });
const AlgoRadixLab = dynamic(() => import("@/components/study/algo-labs").then((m) => m.RadixLab), { ssr: false });
const TocDfaLab = dynamic(() => import("@/components/study/toc-labs").then((m) => m.DfaLab), { ssr: false });
const TocNfaLab = dynamic(() => import("@/components/study/toc-labs").then((m) => m.NfaLab), { ssr: false });
const TocRegexLab = dynamic(() => import("@/components/study/toc-labs").then((m) => m.RegexLab), { ssr: false });
const TocMinLab = dynamic(() => import("@/components/study/toc-labs").then((m) => m.MinLab), { ssr: false });
const TocProductLab = dynamic(() => import("@/components/study/toc-labs").then((m) => m.ProductLab), { ssr: false });
const TocPumpLab = dynamic(() => import("@/components/study/toc-labs").then((m) => m.PumpLab), { ssr: false });
const TocClassifyLab = dynamic(() => import("@/components/study/toc-labs").then((m) => m.ClassifyLab), { ssr: false });
const TocCfgLab = dynamic(() => import("@/components/study/toc-labs").then((m) => m.CfgLab), { ssr: false });
const TocCykLab = dynamic(() => import("@/components/study/toc-labs").then((m) => m.CykLab), { ssr: false });
const TocPdaLab = dynamic(() => import("@/components/study/toc-labs").then((m) => m.PdaLab), { ssr: false });
const TocCfPumpLab = dynamic(() => import("@/components/study/toc-labs").then((m) => m.CfPumpLab), { ssr: false });
const TocCfClassLab = dynamic(() => import("@/components/study/toc-labs").then((m) => m.CfClassifyLab), { ssr: false });
const TocTmLab = dynamic(() => import("@/components/study/toc-labs").then((m) => m.TmLab), { ssr: false });
const TocRecReLab = dynamic(() => import("@/components/study/toc-labs").then((m) => m.RecReLab), { ssr: false });
const TocDiagLab = dynamic(() => import("@/components/study/toc-labs").then((m) => m.DiagLab), { ssr: false });
const TocRiceLab = dynamic(() => import("@/components/study/toc-labs").then((m) => m.RiceLab), { ssr: false });
const TocDecideLab = dynamic(() => import("@/components/study/toc-labs").then((m) => m.DecideLab), { ssr: false });
const CoaCacheGeoLab = dynamic(() => import("@/components/study/coa-labs").then((m) => m.CacheGeoLab), { ssr: false });
const CoaCacheSimLab = dynamic(() => import("@/components/study/coa-labs").then((m) => m.CacheSimLab), { ssr: false });
const CoaAmatLab = dynamic(() => import("@/components/study/coa-labs").then((m) => m.AmatLab), { ssr: false });
const IsaOpcodeLab = dynamic(() => import("@/components/study/isa-labs").then((m) => m.OpcodeLab), { ssr: false });
const IsaModeLab = dynamic(() => import("@/components/study/isa-labs").then((m) => m.ModeLab), { ssr: false });
const IsaStackLab = dynamic(() => import("@/components/study/isa-labs").then((m) => m.StackLab), { ssr: false });
const DpAluLab = dynamic(() => import("@/components/study/datapath-labs").then((m) => m.AluLab), { ssr: false });
const DpCycleLab = dynamic(() => import("@/components/study/datapath-labs").then((m) => m.CycleLab), { ssr: false });
const DpMicroLab = dynamic(() => import("@/components/study/datapath-labs").then((m) => m.MicroLab), { ssr: false });
const PipeTimingLab = dynamic(() => import("@/components/study/pipeline-labs").then((m) => m.PipeLab), { ssr: false });
const PipeHazardLab = dynamic(() => import("@/components/study/pipeline-labs").then((m) => m.HazardLab), { ssr: false });
const PipeCpiLab = dynamic(() => import("@/components/study/pipeline-labs").then((m) => m.CpiLab), { ssr: false });
const MmDesignLab = dynamic(() => import("@/components/study/mainmem-labs").then((m) => m.MemDesignLab), { ssr: false });
const MmInterleaveLab = dynamic(() => import("@/components/study/mainmem-labs").then((m) => m.InterleaveLab), { ssr: false });
const MmDiskLab = dynamic(() => import("@/components/study/mainmem-labs").then((m) => m.DiskLab), { ssr: false });
const MmHammingLab = dynamic(() => import("@/components/study/mainmem-labs").then((m) => m.HammingLab), { ssr: false });
const IoCompareLab = dynamic(() => import("@/components/study/io-labs").then((m) => m.IoCompareLab), { ssr: false });
const IoDaisyLab = dynamic(() => import("@/components/study/io-labs").then((m) => m.DaisyLab), { ssr: false });
const IoDmaLab = dynamic(() => import("@/components/study/io-labs").then((m) => m.DmaLab), { ssr: false });
const IoBusLab = dynamic(() => import("@/components/study/io-labs").then((m) => m.BusLab), { ssr: false });
const AlgoChainLab = dynamic(() => import("@/components/study/algo-labs").then((m) => m.ChainLab), { ssr: false });
const AlgoOpenAddrLab = dynamic(() => import("@/components/study/algo-labs").then((m) => m.OpenAddrLab), { ssr: false });
const AlgoProbesLab = dynamic(() => import("@/components/study/algo-labs").then((m) => m.ProbesLab), { ssr: false });
const AlgoMaxMinLab = dynamic(() => import("@/components/study/algo-labs").then((m) => m.MaxMinLab), { ssr: false });
const AlgoMultLab = dynamic(() => import("@/components/study/algo-labs").then((m) => m.MultLab), { ssr: false });
const AlgoSelectLab = dynamic(() => import("@/components/study/algo-labs").then((m) => m.SelectLab), { ssr: false });
const Algo2ActivityLab = dynamic(() => import("@/components/study/algo-labs-2").then((m) => m.ActivityLab), { ssr: false });
const Algo2FracKnapLab = dynamic(() => import("@/components/study/algo-labs-2").then((m) => m.FracKnapLab), { ssr: false });
const Algo2HuffmanLab = dynamic(() => import("@/components/study/algo-labs-2").then((m) => m.HuffmanLab), { ssr: false });
const Algo2LcsLab = dynamic(() => import("@/components/study/algo-labs-2").then((m) => m.LcsLab), { ssr: false });
const Algo2Knap01Lab = dynamic(() => import("@/components/study/algo-labs-2").then((m) => m.Knap01Lab), { ssr: false });
const Algo2McmLab = dynamic(() => import("@/components/study/algo-labs-2").then((m) => m.McmLab), { ssr: false });
const Algo2CoinsLab = dynamic(() => import("@/components/study/algo-labs-2").then((m) => m.CoinsLab), { ssr: false });
const Algo2BipartiteLab = dynamic(() => import("@/components/study/algo-labs-2").then((m) => m.BipartiteLab), { ssr: false });
const Algo2TopoLab = dynamic(() => import("@/components/study/algo-labs-2").then((m) => m.TopoLab), { ssr: false });
const Algo2SccLab = dynamic(() => import("@/components/study/algo-labs-2").then((m) => m.SccLab), { ssr: false });
const Algo2KruskalLab = dynamic(() => import("@/components/study/algo-labs-2").then((m) => m.KruskalLab), { ssr: false });
const Algo2PrimLab = dynamic(() => import("@/components/study/algo-labs-2").then((m) => m.PrimLab), { ssr: false });
const Algo2MstCountLab = dynamic(() => import("@/components/study/algo-labs-2").then((m) => m.MstCountLab), { ssr: false });
const Algo2DijkstraLab = dynamic(() => import("@/components/study/algo-labs-2").then((m) => m.DijkstraLab), { ssr: false });
const Algo2BellmanLab = dynamic(() => import("@/components/study/algo-labs-2").then((m) => m.BellmanLab), { ssr: false });
const Algo2FwLab = dynamic(() => import("@/components/study/algo-labs-2").then((m) => m.FwLab), { ssr: false });
const RrLab = dynamic(() => import("@/components/study/os-more-labs").then((m) => m.RrLab), { ssr: false });
const PageFaultLab = dynamic(() => import("@/components/study/os-more-labs").then((m) => m.PageFaultLab), { ssr: false });
const WorkingSetLab = dynamic(() => import("@/components/study/os-more-labs").then((m) => m.WorkingSetLab), { ssr: false });

const DmTruthLab = dynamic(() => import("@/components/study/dm-labs").then((m) => m.TruthLab), { ssr: false, loading: () => <div className="card-pastel h-48 animate-pulse" data-tint="plain" aria-hidden /> });
const DmEquivLab = dynamic(() => import("@/components/study/dm-labs").then((m) => m.EquivLab), { ssr: false, loading: () => <div className="card-pastel h-48 animate-pulse" data-tint="plain" aria-hidden /> });
const DmQuantLab = dynamic(() => import("@/components/study/dm-labs").then((m) => m.QuantLab), { ssr: false, loading: () => <div className="card-pastel h-48 animate-pulse" data-tint="plain" aria-hidden /> });
const DmFolLab = dynamic(() => import("@/components/study/dm-labs").then((m) => m.FolLab), { ssr: false, loading: () => <div className="card-pastel h-48 animate-pulse" data-tint="plain" aria-hidden /> });
const DmRelationLab = dynamic(() => import("@/components/study/dm-labs").then((m) => m.RelationLab), { ssr: false, loading: () => <div className="card-pastel h-48 animate-pulse" data-tint="plain" aria-hidden /> });
const DmFuncLab = dynamic(() => import("@/components/study/dm-labs").then((m) => m.FuncLab), { ssr: false, loading: () => <div className="card-pastel h-48 animate-pulse" data-tint="plain" aria-hidden /> });
const DmHasseLab = dynamic(() => import("@/components/study/dm-labs").then((m) => m.HasseLab), { ssr: false, loading: () => <div className="card-pastel h-48 animate-pulse" data-tint="plain" aria-hidden /> });
const DmLatticeLab = dynamic(() => import("@/components/study/dm-labs").then((m) => m.LatticeLab), { ssr: false, loading: () => <div className="card-pastel h-48 animate-pulse" data-tint="plain" aria-hidden /> });
const DmAlgebraLab = dynamic(() => import("@/components/study/dm-labs").then((m) => m.AlgebraLab), { ssr: false, loading: () => <div className="card-pastel h-48 animate-pulse" data-tint="plain" aria-hidden /> });
const DmCyclicLab = dynamic(() => import("@/components/study/dm-labs").then((m) => m.CyclicLab), { ssr: false, loading: () => <div className="card-pastel h-48 animate-pulse" data-tint="plain" aria-hidden /> });
const DmGraphLab = dynamic(() => import("@/components/study/dm-labs").then((m) => m.GraphLab), { ssr: false, loading: () => <div className="card-pastel h-48 animate-pulse" data-tint="plain" aria-hidden /> });
const DmColourLab = dynamic(() => import("@/components/study/dm-labs").then((m) => m.ColourLab), { ssr: false, loading: () => <div className="card-pastel h-48 animate-pulse" data-tint="plain" aria-hidden /> });
const DmCountLab = dynamic(() => import("@/components/study/dm-labs").then((m) => m.CountLab), { ssr: false, loading: () => <div className="card-pastel h-48 animate-pulse" data-tint="plain" aria-hidden /> });
const DmDerangeLab = dynamic(() => import("@/components/study/dm-labs").then((m) => m.DerangeLab), { ssr: false, loading: () => <div className="card-pastel h-48 animate-pulse" data-tint="plain" aria-hidden /> });
const DmRecurLab = dynamic(() => import("@/components/study/dm-labs").then((m) => m.RecurLab), { ssr: false, loading: () => <div className="card-pastel h-48 animate-pulse" data-tint="plain" aria-hidden /> });
const DmGenFunLab = dynamic(() => import("@/components/study/dm-labs").then((m) => m.GenFunLab), { ssr: false, loading: () => <div className="card-pastel h-48 animate-pulse" data-tint="plain" aria-hidden /> });

const labLoading = () => <div className="card-pastel h-48 animate-pulse" data-tint="plain" aria-hidden />;
const MlfqLab = dynamic(() => import("@/components/study/os-extra-labs").then((m) => m.MlfqLab), { ssr: false, loading: labLoading });
const PipeLab = dynamic(() => import("@/components/study/os-extra-labs").then((m) => m.PipeLab), { ssr: false, loading: labLoading });
const SegmentLab = dynamic(() => import("@/components/study/os-extra-labs").then((m) => m.SegmentLab), { ssr: false, loading: labLoading });
const EncapLab = dynamic(() => import("@/components/study/cn-labs").then((m) => m.EncapLab), { ssr: false, loading: labLoading });
const DelayLab = dynamic(() => import("@/components/study/cn-labs").then((m) => m.DelayLab), { ssr: false, loading: labLoading });
const CrcLab = dynamic(() => import("@/components/study/cn-labs").then((m) => m.CrcLab), { ssr: false, loading: labLoading });
const WindowLab = dynamic(() => import("@/components/study/cn-labs").then((m) => m.WindowLab), { ssr: false, loading: labLoading });
const MacLab = dynamic(() => import("@/components/study/cn-labs").then((m) => m.MacLab), { ssr: false, loading: labLoading });
const SubnetLab = dynamic(() => import("@/components/study/cn-labs").then((m) => m.SubnetLab), { ssr: false, loading: labLoading });
const FragLab = dynamic(() => import("@/components/study/cn-labs").then((m) => m.FragLab), { ssr: false, loading: labLoading });
const RouteLab = dynamic(() => import("@/components/study/cn-labs").then((m) => m.RouteLab), { ssr: false, loading: labLoading });
const SeqLab = dynamic(() => import("@/components/study/cn-labs").then((m) => m.SeqLab), { ssr: false, loading: labLoading });
const CwndLab = dynamic(() => import("@/components/study/cn-labs").then((m) => m.CwndLab), { ssr: false, loading: labLoading });
const HttpLab = dynamic(() => import("@/components/study/cn-labs").then((m) => m.HttpLab), { ssr: false, loading: labLoading });
const PortsLab = dynamic(() => import("@/components/study/cn-labs").then((m) => m.PortsLab), { ssr: false, loading: labLoading });
const RagLab = dynamic(() => import("@/components/study/rag-lab").then((m) => m.RagLab), { ssr: false, loading: labLoading });
const BankerLab = dynamic(() => import("@/components/study/deadlock-labs").then((m) => m.BankerLab), { ssr: false, loading: labLoading });
const CountLab = dynamic(() => import("@/components/study/deadlock-labs").then((m) => m.CountLab), { ssr: false, loading: labLoading });
const DetectLab = dynamic(() => import("@/components/study/deadlock-labs").then((m) => m.DetectLab), { ssr: false, loading: labLoading });
const PreventLab = dynamic(() => import("@/components/study/deadlock-labs").then((m) => m.PreventLab), { ssr: false, loading: labLoading });
const StarveLab = dynamic(() => import("@/components/study/deadlock-labs").then((m) => m.StarveLab), { ssr: false, loading: labLoading });
const ForkLab = dynamic(() => import("@/components/study/process-labs").then((m) => m.ForkLab), { ssr: false, loading: labLoading });
const ProcessStateLab = dynamic(() => import("@/components/study/process-labs").then((m) => m.ProcessStateLab), { ssr: false, loading: labLoading });
const SyscallLab = dynamic(() => import("@/components/study/process-labs").then((m) => m.SyscallLab), { ssr: false, loading: labLoading });
const ThreadLab = dynamic(() => import("@/components/study/process-labs").then((m) => m.ThreadLab), { ssr: false, loading: labLoading });
const SchedLab = dynamic(() => import("@/components/study/sched-lab").then((m) => m.SchedLab), { ssr: false, loading: labLoading });
const BufferLab = dynamic(() => import("@/components/study/sync-labs").then((m) => m.BufferLab), { ssr: false, loading: labLoading });
const RaceLab = dynamic(() => import("@/components/study/sync-labs").then((m) => m.RaceLab), { ssr: false, loading: labLoading });
const SemaphoreLab = dynamic(() => import("@/components/study/sync-labs").then((m) => m.SemaphoreLab), { ssr: false, loading: labLoading });
const FitLab = dynamic(() => import("@/components/study/memory-labs").then((m) => m.FitLab), { ssr: false, loading: labLoading });
const PagingLab = dynamic(() => import("@/components/study/memory-labs").then((m) => m.PagingLab), { ssr: false, loading: labLoading });
const TlbLab = dynamic(() => import("@/components/study/memory-labs").then((m) => m.TlbLab), { ssr: false, loading: labLoading });
const ReplaceLab = dynamic(() => import("@/components/study/vm-labs").then((m) => m.ReplaceLab), { ssr: false, loading: labLoading });
const AllocLab = dynamic(() => import("@/components/study/fs-labs").then((m) => m.AllocLab), { ssr: false, loading: labLoading });
const DiskLab = dynamic(() => import("@/components/study/fs-labs").then((m) => m.DiskLab), { ssr: false, loading: labLoading });
import { memo, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { markSeen } from "@/lib/study/progress";
import { bestBundleFor, chapterInfo, rupees } from "@/lib/study/packs";
import { openStudyShop } from "@/store/use-study-shop-store";
import { usePathname } from "next/navigation";
import { createPortal } from "react-dom";
import { motion } from "motion/react";
import { StudyTabs } from "@/components/study/study-tabs";
import { rememberScroll, recallScroll, useStudyTabs } from "@/lib/study/tabs";
import { CHAPTERS } from "@/lib/study/chapters";
import { CS_SHELF } from "@/lib/study/catalog";
import { saveNote, useNotes } from "@/lib/desk/stores";
import { NoteEditor } from "@/components/desk/note-editor";
import { NotebookPen } from "lucide-react";
import { Inline, Rich, splitCodeQ } from "./rich-text";
import { useFocusStore } from "@/store/use-focus-store";
import { addToRevision } from "@/lib/desk/revision";
import { useToastStore } from "@/store/use-toast-store";
import { Lock, ArrowLeft, ArrowUpRight, Check, ChevronDown, ChevronLeft, ChevronRight, ListTree, BookOpenText, ChevronsLeft, ChevronsRight, ExternalLink, X as XIcon, CircleCheck, CircleX, Lightbulb, Link2, Repeat, RotateCcw, Target, TriangleAlert, Zap, Sparkles } from "lucide-react";
import type { Block, Chapter, CheckQ, Topic, BookNode } from "@/lib/study/schema";
import { Diagram } from "@/components/study/diagram";
import { LessonTools } from "@/components/study/lesson-tools";
import { useLessonHighlights } from "@/components/study/lesson-highlights";
import Link from "next/link";

type B<T extends Block["type"]> = Extract<Block, { type: T }>;
const card = (tint: string, extra = "") => ({ className: `card-pastel p-5 sm:p-6 ${extra}`, "data-tint": tint });
const plain = "rounded-[var(--card-radius,24px)] border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-6";
const Label = ({ icon, children }: { icon?: ReactNode; children: ReactNode }) => <p className="flex items-center gap-2 text-sm font-bold text-[var(--tint-ink,var(--text-primary))]">{icon}{children}{icon && <span aria-hidden className="tile-mark">{icon}</span>}</p>;

/* ------------------------------------------------------------------ check questions */
function CheckQuestion({ q, n }: { q: CheckQ; n: number }) {
  const [pick, setPick] = useState<string[]>([]);
  const [nat, setNat] = useState("");
  const [shown, setShown] = useState(false);
  const [sol, setSol] = useState(false); // the worked solution, on request: before or after answering
  const letters = ["A", "B", "C", "D"];
  const correct = q.answer.split(",").map((x) => x.trim());
  const mine = q.kind === "NAT" ? nat.trim() : [...pick].sort().join(", ");
  // numbers are compared as numbers (2.5 = 2.50), within a small tolerance for rounding
  const right = shown && (q.kind === "NAT" ? Number.isFinite(parseFloat(mine)) && Math.abs(parseFloat(mine) - parseFloat(q.answer)) <= 0.01 : mine === q.answer);
  const toggle = (l: string) => { if (shown) return; setPick((p) => (q.kind === "MSQ" ? (p.includes(l) ? p.filter((x) => x !== l) : [...p, l]) : [l])); };
  const can = q.kind === "NAT" ? nat.trim() !== "" : pick.length > 0;
  const tone = (l: string) => {
    if (!shown && !sol) return pick.includes(l) ? "border-[var(--text-primary)] bg-[var(--surface-secondary)]" : "border-[var(--border)] hover:bg-[var(--surface-secondary)]";
    if (correct.includes(l)) return "border-emerald-600 bg-emerald-500/12";
    if (!shown) return pick.includes(l) ? "border-[var(--text-primary)] bg-[var(--surface-secondary)]" : "border-[var(--border)] opacity-70";
    if (pick.includes(l)) return "border-rose-600 bg-rose-500/12";
    return "border-[var(--border)] opacity-70";
  };
  return (
    <li className={plain}>
      <p className="text-xs font-bold text-[var(--text-secondary)]">Question {n} · {q.kind === "MSQ" ? "MSQ, pick all that apply" : q.kind === "NAT" ? "NAT, type a number" : "MCQ, pick one"} · {q.marks} mark{q.marks > 1 ? "s" : ""} · {q.kind === "MCQ" ? (q.marks === 1 ? "−1/3 if wrong" : "−2/3 if wrong") : "no negative marks"}</p>
      {(() => { const sp = splitCodeQ(q.q); return sp ? <>{sp.before && <p className="mt-2 text-[15px] leading-relaxed text-[var(--text-primary)]"><Rich s={sp.before} /></p>}<div className="mt-2"><CodeEditor text={sp.code} name="question.c" /></div>{sp.after && <p className="mt-1 text-[15px] font-semibold leading-relaxed text-[var(--text-primary)]"><Rich s={sp.after} /></p>}</> : <p className="mt-2 text-[15px] leading-relaxed text-[var(--text-primary)]"><Rich s={q.q} /></p>; })()}
      {q.options ? (
        <ul className="mt-3 grid gap-2" role={q.kind === "MSQ" ? "group" : "radiogroup"} aria-label={`Options for question ${n}`}>
          {q.options.map((o, i) => {
            const l = letters[i], on = pick.includes(l);
            return (
              <li key={i}>
                <button type="button" onClick={() => toggle(l)} role={q.kind === "MSQ" ? "checkbox" : "radio"} aria-checked={on} disabled={shown || sol}
                  className={`flex w-full items-start gap-3 rounded-xl border-2 px-3 py-2.5 text-left text-sm transition-colors ${tone(l)}`}>
                  <span aria-hidden className={`mt-0.5 grid h-5 w-5 shrink-0 place-items-center border-2 border-[var(--text-primary)] ${q.kind === "MSQ" ? "rounded-md" : "rounded-full"} ${on ? "bg-[var(--text-primary)] text-[var(--background)]" : ""}`}>
                    {on && (q.kind === "MSQ" ? <Check className="h-3.5 w-3.5" strokeWidth={3} /> : <span className="h-2 w-2 rounded-full bg-[var(--background)]" />)}
                  </span>
                  <span className="min-w-0 flex-1 text-[var(--text-primary)]"><b className="mr-1.5">{l}.</b><Rich s={o} /></span>
                  {(shown || sol) && correct.includes(l) && <CircleCheck className="h-5 w-5 shrink-0 text-emerald-600" aria-label="Correct option" />}
                  {shown && on && !correct.includes(l) && <CircleX className="h-5 w-5 shrink-0 text-rose-600" aria-label="Wrong pick" />}
                </button>
              </li>
            );
          })}
        </ul>
      ) : (
        <input value={nat} onChange={(e) => setNat(e.target.value)} disabled={shown || sol} inputMode="decimal" aria-label="Your answer" placeholder="Your answer"
          className={`mt-3 h-11 w-44 rounded-xl border-2 bg-[var(--surface)] px-3 font-num text-[var(--text-primary)] ${shown ? (right ? "border-emerald-600" : "border-rose-600") : "border-[var(--border)]"}`} />
      )}
      <div className="mt-4 flex flex-wrap items-center gap-3">
        {!shown ? <button type="button" onClick={() => setShown(true)} disabled={!can} className="pill-ink disabled:opacity-40">Check answer</button>
          : <button type="button" onClick={() => { setShown(false); setSol(false); setPick([]); setNat(""); }} className="pill-soft"><RotateCcw className="h-4 w-4" aria-hidden /> Try again</button>}
        <button type="button" onClick={() => setSol((v) => !v)} aria-expanded={sol} className="pill-soft"><Lightbulb className="h-4 w-4" aria-hidden /> {sol ? "Hide solution" : "Show solution"}</button>
        {shown && <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-bold ${right ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300" : "bg-rose-500/15 text-rose-700 dark:text-rose-300"}`}>{right ? <CircleCheck className="h-4 w-4" /> : <CircleX className="h-4 w-4" />}{right ? "Correct" : `Not quite. Answer: ${q.answer}`}</span>}
      </div>
      {sol && <div className="mt-3 rounded-xl bg-[var(--surface-secondary)] p-3 text-sm leading-relaxed text-[var(--text-primary)]"><p className="font-bold">Answer: <span className="font-num">{q.answer}</span></p><p className="mt-1">{q.solution}</p></div>}
    </li>
  );
}

function FadedStep({ s }: { s: { say: string; blank?: boolean; answer?: string } }) {
  const [open, setOpen] = useState(false);
  return (
    <li className="text-[15px] leading-relaxed text-[var(--text-primary)]">{s.say}
      {s.blank && (open ? <p className="mt-1 rounded-lg bg-[var(--surface)] p-2 text-sm">{s.answer}</p> : <button type="button" onClick={() => setOpen(true)} className="ml-2 text-sm font-bold underline underline-offset-4">Show answer</button>)}
    </li>
  );
}

/* ------------------------------------------------------------------ single blocks */
const Hook = ({ b }: { b: B<"hook"> }) => <div {...card("butter")}><p className="font-display text-xl font-bold leading-relaxed text-[var(--text-primary)]">{b.text}</p></div>;
const Objectives = ({ b }: { b: B<"objectives"> }) => <div {...card("peri")}><Label icon={<Target className="h-4 w-4" aria-hidden />}>What you will learn</Label><ul className="mt-2 list-disc space-y-1 pl-5 text-[15px] text-[var(--text-primary)]">{b.items.map((t) => <li key={t}>{t}</li>)}</ul></div>;
const Intuition = ({ b }: { b: B<"intuition"> }) => <section className={plain}><h3 className="lesson-h">The idea</h3>{b.paras.map((p, i) => <p key={i} className="lesson-p mt-2">{p}</p>)}{b.analogyLimit && <p className="mt-3 rounded-xl bg-[var(--surface-secondary)] p-3 text-sm text-[var(--text-secondary)]"><b className="text-[var(--text-primary)]">Where the picture breaks: </b>{b.analogyLimit}</p>}</section>;
const Definition = ({ b }: { b: B<"definition"> }) => <section {...card("lilac")}><h3 className="lesson-h !mb-1">{b.name}</h3><p className="lesson-p">{b.text}</p>{b.items && <ol className="mt-3 space-y-2">{b.items.map((t, i) => <li key={t} className="flex gap-3 rounded-xl bg-[var(--surface)] p-3"><span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-[var(--tint-ink)] text-xs font-bold text-[var(--surface)]">{i + 1}</span><span className="text-[15px] text-[var(--text-primary)]">{t}</span></li>)}</ol>}</section>;
const Deep = ({ b }: { b: B<"deep"> }) => (
  <section className={plain}>
    <h3 className="lesson-h">In depth</h3>
    <div className="mt-3 grid gap-x-10 gap-y-6 @3xl:grid-cols-2">
      {b.sections.map((x) => (
        <div key={x.h}>
          <h4 className="font-display text-lg font-extrabold text-[var(--st-accent,var(--text-primary))]">{x.h}</h4>
          {x.paras.map((p, i) => <p key={i} className="lesson-p mt-2">{p}</p>)}
          {x.points && <ul className="mt-2 list-disc space-y-1 pl-5 text-[15px] leading-relaxed text-[var(--text-primary)]">{x.points.map((t) => <li key={t}>{t}</li>)}</ul>}
        </div>
      ))}
    </div>
  </section>
);
const Walk = ({ b }: { b: B<"walkthrough"> }) => <section className={plain}><h3 className="lesson-h">Step by step</h3><ol className="mt-2 space-y-2">{b.steps.map((s, i) => <li key={i} className="flex gap-3"><span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-[var(--ink)] text-xs font-bold text-[var(--background)]">{i + 1}</span><p className="lesson-p"><Rich s={s} /></p></li>)}</ol>{b.prompt && <details className="mt-3 rounded-xl bg-[var(--surface-secondary)] p-3">{(() => { const sp = splitCodeQ(b.prompt.q); return <><summary className="cursor-pointer text-sm font-bold text-[var(--text-primary)]">Think: {sp ? <Rich s={sp.after || sp.before || "what happens?"} /> : <Rich s={b.prompt.q} />}</summary>{sp && <div className="mt-2"><CodeEditor text={sp.code} name="think.c" /></div>}</>; })()}<p className="mt-2 text-sm text-[var(--text-secondary)]"><Rich s={b.prompt.a} /></p></details>}</section>;
const Figure = ({ b }: { b: B<"figure"> }) => <figure className={`${plain} grid grid-cols-[minmax(0,1fr)] content-center justify-items-center gap-2`}><Diagram fig={b.fig} /><figcaption className="text-center text-sm text-[var(--text-secondary)]">{b.caption}</figcaption><span className="sr-only">{b.alt}</span></figure>;
const Example = ({ b, code }: { b: B<"example">; code?: boolean }) => (
  <section {...card("sky")}><p className="select-none text-xs font-bold text-[var(--tint-ink)]">Worked example{b.level === "edge" ? ", edge case" : b.level === "gate" ? ", GATE level" : ""}</p><h3 className="lesson-h !mt-1">{b.title}</h3>
    {code && b.file?.endsWith(".txt") ? <><p className="lesson-p"><b>Given:</b></p><pre className="mt-2 overflow-x-auto whitespace-pre-wrap rounded-xl border border-[var(--border)] bg-[var(--surface)] p-3 font-mono text-[0.92rem] leading-6 text-[var(--text-primary)]">{b.given}</pre></> : code ? <><p className="lesson-p"><b>Given:</b></p><CodeEditor text={b.given} name={b.file ?? "trace.c"} /></> :<p className="lesson-p"><b>Given: </b>{b.given}</p>}<p className="lesson-p mt-1"><b>Find: </b><Rich s={b.find} /></p>
    <ol className="mt-3 space-y-2">{b.steps.map((s, i) => <li key={i} className="flex gap-3 rounded-xl bg-[var(--surface)] p-3"><span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-[var(--tint-ink)] text-xs font-bold text-[var(--surface)]">{i + 1}</span><p className="text-[15px] leading-relaxed text-[var(--text-primary)]"><Rich s={s.say} />{s.result && <b className="ml-1">→ <Rich s={s.result} /></b>}</p></li>)}</ol>
    <p className="mt-3 rounded-xl bg-[var(--surface)] p-3 font-bold text-[var(--text-primary)]">Answer: <Rich s={b.answer} /></p>{b.check && <p className="mt-2 text-sm text-[var(--text-primary)]"><b>Check it another way: </b><Rich s={b.check} /></p>}</section>
);
const Faded = ({ b }: { b: B<"faded"> }) => <section {...card("peach")}><p className="text-xs font-bold text-[var(--tint-ink)]">Try it yourself</p><h3 className="lesson-h !mt-1">{b.title}</h3><div className="mt-2"><CodeEditor text={b.given.replace(/; /g, ";\n")} name="your_turn.c" /></div><ol className="mt-2 list-decimal space-y-2 pl-5">{b.steps.map((s, i) => <FadedStep key={i} s={s} />)}</ol></section>;
const Trap = ({ b }: { b: B<"trap"> }) => <section {...card("rose", "h-full")}><Label icon={<TriangleAlert className="h-4 w-4" aria-hidden />}>Trap</Label><p className="mt-1 font-bold text-[var(--text-primary)]"><Rich s={b.wrong} /></p><p className="mt-2 text-sm leading-6 text-[var(--text-primary)]"><b>Why it feels right: </b><Rich s={b.tempting} /></p><p className="mt-1 text-sm leading-6 text-[var(--text-primary)]"><b>Why it is wrong: </b><Rich s={b.whyWrong} /></p>{b.ex && <div className="mt-3 rounded-xl border border-dashed border-[var(--tint-ink,var(--border))] bg-[var(--surface)]/70 p-3"><p className="text-xs font-extrabold uppercase tracking-wide text-[var(--tint-ink)]">See it happen</p>{b.ex.code && <div className="mt-2"><CodeEditor text={b.ex.code} out={b.ex.out} name="trap_example.c" /></div>}{b.ex.text && <p className="mt-2 text-sm leading-6 text-[var(--text-primary)]"><Rich s={b.ex.text} /></p>}</div>}<p className="mt-3 rounded-xl bg-[var(--surface)] p-2.5 text-sm font-bold leading-6 text-[var(--text-primary)]">Rule: <Rich s={b.rule} /></p></section>;
const Shortcut = ({ b }: { b: B<"shortcut"> }) => <section {...card("mint")}><Label icon={<Zap className="h-4 w-4" aria-hidden />}>Shortcut</Label><p className="lesson-p mt-1"><Rich s={b.text} /></p><p className="mt-1 text-sm">Valid when: <Rich s={b.validWhen} /></p></section>;
const Gate = ({ b }: { b: B<"gate"> }) => <section {...card("butter", "h-full")}><Label icon={<Lightbulb className="h-4 w-4" aria-hidden />}>How GATE asks it</Label><p className="lesson-p mt-1"><Rich s={b.text} /></p></section>;
/** One personal note on this topic, kept in the Notes tab with everything else; the button shows when there is already one. */
function TopicNoteButton({ t, meta }: { t: Topic; meta: { subject: string; topic: string } }) {
  const [open, setOpen] = useState(false);
  const has = useNotes((s) => s.items.some((n) => n.source === "study" && n.refId === t.id && n.kind === "note"));
  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className="inline-flex h-10 cursor-pointer items-center gap-1.5 rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 text-sm font-bold text-[var(--text-secondary)] hover:text-[var(--text-primary)]" aria-label={has ? "Edit my note on this topic" : "Add a note on this topic"}>
        <NotebookPen className="h-4 w-4" aria-hidden /> {has ? "My note" : "Add a note"}
      </button>
      <NoteEditor open={open} onClose={() => setOpen(false)} title="Note on this topic" initial={{ source: "study", refId: t.id, subject: meta.subject, topic: meta.topic, title: t.title }} />
    </>
  );
}

/** A recall card can be kept: it goes into the Notes (source Study) and into the Revision queue, so it comes back on the schedule. */
function keepRecall(c: { q: string; a: string }, meta: { subject: string; topic: string }) {
  const n = saveNote({ source: "study", kind: "note", refId: `recall:${c.q.slice(0, 80)}`, title: c.q, body: c.a, subject: meta.subject, topic: meta.topic, revise: true });
  const made = addToRevision({ kind: "note", refId: n.id, source: "note", title: c.q, subject: meta.subject, topic: meta.topic });
  useToastStore.getState().show(made ? "Added to your revision queue" : "Already in your revision queue", "success");
}
const Recall = ({ b, meta }: { b: B<"recall">; meta?: { subject: string; topic: string } }) => <section {...card("mint", "h-full")}><Label icon={<Repeat className="h-4 w-4" aria-hidden />}>Recall cards (tap to reveal)</Label><ul className="mt-3 grid gap-2 sm:grid-cols-3">{b.cards.map((c) => <li key={c.q}><details className="h-full rounded-xl bg-[var(--surface)] p-3"><summary className="cursor-pointer text-sm font-semibold text-[var(--text-primary)]">{c.q}</summary><p className="mt-2 text-sm text-[var(--text-secondary)]">{c.a}</p>{meta && <button type="button" onClick={() => keepRecall(c, meta)} className="pill-soft mt-2 cursor-pointer text-xs"><Repeat className="mr-1 inline h-3 w-3" aria-hidden />Revise this</button>}</details></li>)}</ul></section>;
const Links = ({ b }: { b: B<"links"> }) => <section className={plain}><Label icon={<Link2 className="h-4 w-4" aria-hidden />}>How this connects</Label><div className="mt-2 grid gap-4 text-sm sm:grid-cols-3">{([["Needs", b.prereq], ["Used later in", b.usedIn], ["Other subjects", b.cross]] as const).map(([h, l]) => l?.length ? <div key={h}><p className="font-bold text-[var(--text-primary)]">{h}</p><ul className="mt-1 list-disc pl-5 text-[var(--text-secondary)]">{l.map((x) => <li key={x}>{x}</li>)}</ul></div> : null)}</div></section>;

/** "Where to go next" (owner, 19 Nov): a card for a topic in this chapter scrolls to it; "Real GATE questions" on this subject opens
 *  the PYQs panel in the lesson instead of leaving it; anything else opens normally. */
function onPractice(e: React.MouseEvent<HTMLAnchorElement>, l: { label: string; href: string }) {
  const el = e.currentTarget; const here = typeof window !== "undefined" && l.href === window.location.pathname;
  const topicNo = /^Topic (\d+)/.exec(l.label)?.[1];
  if (here && topicNo) {
    const pane = el.closest("[data-topic]")?.parentElement; const ids = pane ? [...pane.querySelectorAll(":scope > [data-topic]")].map((x) => x.id) : [];
    const id = ids[Number(topicNo) - 1]; if (id) { e.preventDefault(); goTo(id); }
    return;
  }
  const subject = el.closest("[data-subject]")?.getAttribute("data-subject")?.toLowerCase() ?? "";
  if (l.href.startsWith("/topics/") && /^Real GATE questions on /.test(l.label) && subject && l.label.toLowerCase().includes(subject.slice(0, 6))) { e.preventDefault(); window.dispatchEvent(new Event("study:open-pyqs")); }
}
const Practice = ({ b }: { b: B<"practice"> }) => (
  <section className={plain}><Label icon={<ArrowUpRight className="h-4 w-4" aria-hidden />}>Where to go next</Label>
    <ul className="mt-3 grid gap-3 md:grid-cols-3">{b.links.map((l) => <li key={l.href + l.label}><Link href={l.href} onClick={(e) => onPractice(e, l)} className="group flex h-full flex-col rounded-2xl border border-[var(--border)] p-4 transition-colors hover:bg-[var(--surface-secondary)]"><span className="font-bold text-[var(--text-primary)]">{l.label}</span><span className="mt-1 text-sm text-[var(--text-secondary)]">{l.sub}</span><span className="mt-2 text-sm font-bold text-[var(--text-primary)] group-hover:underline">Open</span></Link></li>)}</ul>
  </section>
);

/* ------------------------------------------------------------------ sections (outline + anchors) */
/** lvl: 1 = a numbered chapter section (10.1), 2 = a sub-section (10.1.1); only set for textbook topics. */
type Sec = { key: string; label: string; lvl?: 1 | 2 };
/** Outline rows: a section is bold with a filled number chip; a sub-section is smaller, indented, with a muted number. */
function SecLabel({ sec }: { sec: Sec }) {
  const sp = sec.label.indexOf(" "); const num = sp > 0 && /^[A-Za-z]{0,2}\d/.test(sec.label) ? sec.label.slice(0, sp) : ""; const rest = num ? sec.label.slice(sp + 1) : sec.label;
  if (sec.lvl === 1) return <span className="flex items-start gap-1.5"><b className="mt-px shrink-0 rounded-md px-1.5 py-px text-[11px] font-extrabold tabular-nums text-[var(--surface)]" style={{ background: "var(--st-accent)" }}>{num}</b><span className="min-w-0 flex-1">{rest}</span></span>;
  if (sec.lvl === 2) return <span className="flex items-start gap-1.5"><span className="mt-px shrink-0 rounded-md border border-[color-mix(in_srgb,var(--st-accent)_40%,transparent)] px-1 py-0.5 text-[10.5px] font-bold tabular-nums leading-none text-[var(--st-accent)]">{num}</span><span className="min-w-0 flex-1">{rest}</span></span>;
  return <>{sec.label}</>;
}
const secRow = (sec: Sec) => (sec.lvl === 1 ? "mt-1.5 font-extrabold text-[var(--text-primary)]" : sec.lvl === 2 ? "pl-4 text-[11.5px]" : "");
const SECTIONS_CACHE = new WeakMap<Topic, Sec[]>();
function sectionsOf(t: Topic): Sec[] {
  let s = SECTIONS_CACHE.get(t);
  if (!s) { s = computeSections(t); SECTIONS_CACHE.set(t, s); }
  return s;
}
function computeSections(t: Topic): Sec[] {
  if (t.book) return bookSections(t);
  const has = (k: Block["type"]) => t.blocks.some((b) => b.type === k);
  const exs = t.blocks.filter((b) => b.type === "example") as B<"example">[];
  const out: Sec[] = [];
  if (has("hook") || has("objectives")) out.push({ key: "start", label: "What this is about" });
  if (has("intuition") || has("definition")) out.push({ key: "idea", label: "The idea and the definition" });
  if (has("deep")) out.push({ key: "deep", label: "In depth" });
  if (has("walkthrough")) out.push({ key: "method", label: "Step by step" });
  exs.forEach((e, i) => out.push({ key: `ex${i}`, label: `Example ${i + 1}: ${e.title}` }));
  if (has("lab")) out.push({ key: "lab", label: "Lab: try it yourself" });
  if (has("faded") || has("shortcut")) out.push({ key: "faded", label: "Finish the solution" });
  if (has("trap")) out.push({ key: "traps", label: "Traps" });
  if (has("gate") || has("recall")) out.push({ key: "gate", label: "How GATE asks it" });
  if (has("check")) out.push({ key: "check", label: "Check yourself" });
  if (has("links") || has("practice")) out.push({ key: "next", label: "Where to go next" });
  return out;
}
const secId = (t: Topic, key: string) => `${t.id}--${key}`;
const Sect = ({ t, k, children, className = "" }: { t: Topic; k: string; children: ReactNode; className?: string }) => <section id={secId(t, k)} data-sec="" className={`scroll-mt-24 lg:scroll-mt-4 ${className}`}>{children}</section>;

/* ------------------------------------------------------------------ topic layout in rows */
/** Previous / next topic and a list of every topic with its sections (owner, 19 Nov). Topics share one scroll, so this scrolls. */
function goTo(id: string, tries = 0) {
  const el = document.getElementById(id);
  const far = el ? Math.abs(el.getBoundingClientRect().top) > window.innerHeight * 1.2 : false;
  const behavior = far || window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth";
  if (el) { el.scrollIntoView({ behavior, block: "start" }); return; }
  // a section of a topic that has not been drawn yet: bring its topic into view, then retry once it renders
  const topic = document.getElementById(id.split("--")[0]);
  if (topic && tries < 10) { topic.scrollIntoView({ behavior: "auto", block: "start" }); setTimeout(() => goTo(id, tries + 1), 120); }
}
/** Draw a topic only when it comes near the screen (speed pass, 19 Nov): a chapter's later topics cost nothing until needed. */
/** Shown once, in place of the first topic a reader cannot open: what the rest holds and which pack has it. */
function UnlockCard({ t, index, topics, href }: { t: Topic; index: number; topics: Topic[]; href: string }) {
  const info = chapterInfo(href); const rest = topics.slice(index);
  const bundle = info.pack ? bestBundleFor([info.pack.id]) : null;
  return (
    <section id={t.id} data-topic="" aria-label="Unlock the rest of this chapter" className="card-pastel scroll-mt-24 p-6 sm:p-8 lg:scroll-mt-4" data-tint={info.book?.tint ?? "butter"}>
      <p className="inline-flex items-center gap-1.5 rounded-full bg-[var(--surface)] px-3 py-1 text-xs font-black text-[var(--text-primary)]"><Lock className="h-3.5 w-3.5" /> {info.sampleChapter ? "That was the free sample" : "Part of a study pack"}</p>
      <h2 className="mt-3 font-display text-2xl font-extrabold text-[var(--text-primary)]">{rest.length} more topic{rest.length === 1 ? "" : "s"} in this chapter</h2>
      <ol className="mt-3 space-y-1 text-sm text-[var(--text-primary)]">{rest.map((x, k) => <li key={x.id} className="flex gap-2"><span className="font-num font-bold text-[var(--text-secondary)]">{index + k + 1}.</span>{x.title}</li>)}</ol>
      <p className="mt-4 text-sm text-[var(--text-secondary)]">{info.pack ? `Every chapter of ${info.book?.title ?? "this book"} comes with the ${info.pack.name} pack (${rupees(info.pack.pricePaise)}, about ${info.pack.marks} marks a paper)${bundle ? `, or ${bundle.name} for ${rupees(bundle.pricePaise)} with ${bundle.packs.length - 1} more subjects` : ""}. ` : ""}Study packs are separate from Plus and Pro.</p>
      <button type="button" onClick={() => openStudyShop(info.book ? `Unlock ${info.book.title}` : undefined)} className="btn-study mt-4 inline-flex h-11 items-center rounded-xl px-5">See packs and bundles</button>
    </section>
  );
}
const LazyTopic = memo(function LazyTopic({ t, index, topics, href }: { t: Topic; index: number; topics: Topic[]; href?: string }) {
  // The server sends locked topics as title-only stubs (lib/study/serve.ts); the first one shows the unlock card.
  const locked = !!t.locked;
  const prevLocked = index > 0 && !!topics[index - 1]?.locked;
  const [shown, setShown] = useState(index === 0);
  const ph = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (shown || !ph.current) return;
    const io = new IntersectionObserver((es) => { if (es.some((e) => e.isIntersecting)) setShown(true); }, { rootMargin: "1600px 0px" });
    io.observe(ph.current); return () => io.disconnect();
    // `t.deferred` too: a deferred topic renders a skeleton (nothing to observe) until its text arrives, then the observer must attach.
  }, [shown, t.deferred]);
  // Reading progress (device only): a topic counts as read once it has been on screen for a moment.
  useEffect(() => {
    if (!shown || locked || !href) return;
    const el = document.getElementById(t.id); if (!el) return;
    let timer: ReturnType<typeof setTimeout> | null = null;
    const io = new IntersectionObserver((es) => { if (es.some((e) => e.isIntersecting)) { timer ??= setTimeout(() => markSeen(t.id, href), 4000); } else if (timer) { clearTimeout(timer); timer = null; } }, { threshold: 0.25 });
    io.observe(el); return () => { io.disconnect(); if (timer) clearTimeout(timer); };
  }, [shown, locked, href, t.id]);
  if (t.deferred) return <div id={t.id} data-topic="" aria-busy="true" aria-label={`Topic ${index + 1}: ${t.title}`} className="card-pastel min-h-[24rem] scroll-mt-24 p-6 lg:scroll-mt-4"><div className="skeleton-shimmer h-8 w-2/3 rounded-xl" /><div className="skeleton-shimmer mt-4 h-24 rounded-2xl" /><div className="skeleton-shimmer mt-4 h-40 rounded-2xl" /></div>;
  if (locked) return prevLocked ? <div id={t.id} data-topic="" aria-hidden /> : <UnlockCard t={t} index={index} topics={topics} href={href ?? ""} />;
  if (shown) return <TopicView t={t} index={index} topics={topics} href={href ?? undefined} />;
  return <div ref={ph} id={t.id} data-topic="" aria-label={`Topic ${index + 1}: ${t.title}`} className="min-h-[1600px] scroll-mt-24 rounded-[22px] border border-dashed border-[var(--border)] lg:scroll-mt-4" />;
});
function TopicNav({ topics, index, menuOnly = false }: { topics: Topic[]; index: number; menuOnly?: boolean }) {
  const [open, setOpen] = useState(false);
  const prev = topics[index - 1], next = topics[index + 1];
  const btn = "grid h-9 w-9 place-items-center rounded-full border border-[var(--border)] bg-[var(--surface)] disabled:opacity-35 hover:enabled:bg-[var(--surface-secondary)]";
  return (
    <div className="relative flex shrink-0 items-center gap-1.5">
      {!menuOnly && <button type="button" className={btn} disabled={!prev} onClick={() => prev && goTo(prev.id)} aria-label={prev ? `Previous topic: ${prev.title}` : "No previous topic"}><ChevronLeft className="h-4 w-4" /></button>}
      <button type="button" onClick={() => setOpen((o) => !o)} aria-expanded={open} className="inline-flex h-9 items-center gap-1.5 rounded-full border border-[var(--border)] bg-[var(--surface)] px-3 text-sm font-bold hover:bg-[var(--surface-secondary)]"><ListTree className="h-4 w-4" aria-hidden /> {menuOnly ? "Contents" : <>Topics <span className="font-num text-[var(--text-secondary)]">{index + 1}/{topics.length}</span></>}</button>
      {!menuOnly && <button type="button" className={btn} disabled={!next} onClick={() => next && goTo(next.id)} aria-label={next ? `Next topic: ${next.title}` : "No next topic"}><ChevronRight className="h-4 w-4" /></button>}
      {open && <>
        <button type="button" aria-label="Close topics" className="fixed inset-0 z-[70] cursor-default" onClick={() => setOpen(false)} />
        <div role="menu" className="custom-scrollbar absolute right-0 top-11 z-[80] max-h-[60vh] w-[min(22rem,80vw)] overflow-y-auto rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-2 shadow-[0_20px_40px_-20px_rgba(0,0,0,.5)]">
          {topics.map((x, i) => (
            <div key={x.id} className={`rounded-xl p-2 ${i === index ? "bg-[color-mix(in_srgb,var(--st-accent)_10%,transparent)]" : ""}`}>
              <button type="button" role="menuitem" onClick={() => { setOpen(false); goTo(x.id); }} className="flex w-full items-start gap-2 text-left text-sm font-bold"><span className="font-num text-[var(--st-accent)]">{i + 1}</span><span className="min-w-0">{x.title}</span></button>
              <ul className="mt-1 space-y-0.5 pl-5">{sectionsOf(x).map((sec) => <li key={sec.key}><button type="button" role="menuitem" onClick={() => { setOpen(false); goTo(secId(x, sec.key)); }} className={`w-full rounded-lg px-2 py-0.5 text-left text-xs text-[var(--text-secondary)] hover:bg-[var(--surface-secondary)] hover:text-[var(--text-primary)] ${secRow(sec)}`}><SecLabel sec={sec} /></button></li>)}</ul>
            </div>
          ))}
        </div>
      </>}
    </div>
  );
}

/** Chapters of this subject: previous / next chapter and the whole list, the open chapter expanded to its topics (owner, 19 Nov). */
function ChapterNav({ href, chapter }: { href: string; chapter: Chapter }) {
  const [open, setOpen] = useState(false);
  const [openTopic, setOpenTopic] = useState<string | null>(null); // topics start collapsed
  const [openCh, setOpenCh] = useState<string | null>(href); // the current chapter starts open; any chapter can be opened
  const [loaded, setLoaded] = useState<Record<string, Topic[]>>({});
  const panel = useRef<HTMLDivElement | null>(null);
  const [maxH, setMaxH] = useState<number | null>(null);
  useEffect(() => { if (!open || !panel.current) return; const fit = () => { const t = panel.current?.getBoundingClientRect().top ?? 0; setMaxH(Math.max(220, window.innerHeight - t - 20)); }; fit(); window.addEventListener("resize", fit); return () => window.removeEventListener("resize", fit); }, [open]);
  const openChapter = (h: string) => { setOpenCh((x) => (x === h ? null : h)); if (h !== href && !loaded[h]) CHAPTERS[h]?.().then((c) => setLoaded((m) => ({ ...m, [h]: c.topics }))); };
  const swap = useStudyTabs((st) => st.swap);
  const asTab = (c: { href?: string; title: string }) => ({ href: c.href!, title: c.title, subject: book?.title ?? "", tint: book?.tint });
  const book = CS_SHELF.find((b) => b.chapters.some((c) => c.href === href));
  if (!book) return null;
  const i = book.chapters.findIndex((c) => c.href === href);
  const ready = book.chapters.filter((c) => c.href);
  const r = ready.findIndex((c) => c.href === href);
  const prev = ready[r - 1], next = ready[r + 1];
  const btn = "grid h-8 w-8 place-items-center rounded-full border border-[var(--border)] bg-[var(--surface)] aria-disabled:pointer-events-none aria-disabled:opacity-35";
  return (
    <div className="relative mt-2 flex items-center gap-1.5">
      <Link href={prev?.href ?? href} onClick={() => prev && swap(href, asTab(prev))} aria-disabled={!prev} aria-label={prev ? `Previous chapter: ${prev.title}` : "No previous chapter"} className={btn}><ChevronLeft className="h-4 w-4" /></Link>
      <button type="button" onClick={() => setOpen((o) => !o)} aria-expanded={open} className="inline-flex h-8 min-w-0 flex-1 items-center gap-1.5 rounded-full border border-[var(--border)] bg-[var(--surface)] px-3 text-xs font-bold"><BookOpenText className="h-3.5 w-3.5 shrink-0" aria-hidden /><span className="truncate">Chapter {i + 1} of {book.chapters.length}</span><ChevronDown className="ml-auto h-3.5 w-3.5 shrink-0" aria-hidden /></button>
      <Link href={next?.href ?? href} onClick={() => next && swap(href, asTab(next))} aria-disabled={!next} aria-label={next ? `Next chapter: ${next.title}` : "No next chapter"} className={btn}><ChevronRight className="h-4 w-4" /></Link>
      {open && <>
        <button type="button" aria-label="Close chapters" className="fixed inset-0 z-[70] cursor-default" onClick={() => setOpen(false)} />
        <div ref={panel} role="menu" style={maxH ? { maxHeight: maxH } : undefined} className="absolute left-0 top-10 z-[80] flex max-h-[60vh] w-[min(23rem,86vw)] flex-col overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-[0_24px_48px_-22px_rgba(0,0,0,.55)]">
          <div className="sticky top-0 z-20 flex items-center justify-between gap-2 px-4 py-3 text-[var(--surface)]" style={{ background: "var(--st-accent)" }}>
            <span className="text-xs font-extrabold uppercase tracking-[.16em]">{book.title}</span>
            <span className="rounded-full bg-black/15 px-2 py-0.5 text-[11px] font-bold">{book.chapters.length} chapters</span>
          </div>
          <ol className="custom-scrollbar relative min-h-0 flex-1 overflow-y-auto overscroll-contain px-3 py-3">
            {book.chapters.map((c, k) => {
              const here = c.href === href;
              return (
                <li key={c.id} className="relative pb-2 pl-8">
                  {/* the timeline: one segment per chapter, from this circle down to the next one, centred on the circles */}
                  {k < book.chapters.length - 1 && <span aria-hidden className="absolute -bottom-1.5 left-[calc(1.45rem-1px)] top-[1.875rem] w-0.5 rounded-full" style={{ background: "color-mix(in srgb, var(--st-accent) 35%, transparent)" }} />}
                  <span aria-hidden className={`absolute left-[0.7rem] top-1.5 grid h-6 w-6 place-items-center rounded-full text-[11px] font-extrabold ${here ? "text-[var(--surface)]" : c.href ? "border-2 bg-[var(--surface)]" : "border-2 border-dashed bg-[var(--surface)] text-[var(--text-muted)]"}`} style={here ? { background: "var(--st-accent)" } : c.href ? { borderColor: "var(--st-accent)", color: "var(--st-accent)" } : { borderColor: "var(--border)" }}>{k + 1}</span>
                  {c.href ? (
                    <Link href={c.href} role="menuitem" onClick={() => { setOpen(false); if (!here) swap(href, asTab(c)); }} className={`flex items-start gap-2 rounded-xl px-2.5 py-2 text-sm ${here ? "font-extrabold" : "font-bold hover:bg-[var(--surface-secondary)]"}`} style={here ? { background: "color-mix(in srgb, var(--st-accent) 12%, transparent)" } : undefined}>
                      <span className="min-w-0 flex-1 text-[var(--text-primary)]">{c.title}</span>
                      <span className="shrink-0 rounded-full bg-emerald-700 px-1.5 py-0.5 text-[10px] font-bold text-white">{c.ready?.replace(/ ready.*/, "")}</span>
                      <button type="button" onClick={(e) => { e.preventDefault(); e.stopPropagation(); openChapter(c.href!); }} aria-expanded={openCh === c.href} aria-label={`${openCh === c.href ? "Hide" : "Show"} topics of ${c.title}`} className="-my-1 -mr-1 grid h-7 w-7 shrink-0 place-items-center rounded-full hover:bg-black/5 dark:hover:bg-white/10"><ChevronDown className={`h-4 w-4 transition-transform ${openCh === c.href ? "rotate-180" : ""}`} aria-hidden /></button>
                    </Link>
                  ) : <p className="flex items-start gap-2 px-2.5 py-2 text-sm text-[var(--text-secondary)]"><span className="min-w-0 flex-1">{c.title}</span><span className="shrink-0 text-[10px] font-semibold">Being written</span></p>}
                  {c.href && openCh === c.href && <ul className="mt-1 space-y-1">{(here ? chapter.topics : loaded[c.href] ?? []).map((t, n) => {
                    const on = openTopic === t.id;
                    return (
                      <li key={t.id} className="rounded-xl border border-[var(--border)] bg-[var(--surface)]">
                        <div className="sticky top-0 z-10 flex items-center gap-1 rounded-xl bg-[var(--surface)]">
                          <button type="button" role="menuitem" onClick={() => { setOpen(false); goTo(t.id); }} className="min-w-0 flex-1 px-2.5 py-2 text-left text-[13px] font-bold leading-snug text-[var(--text-primary)]"><span className="mr-1.5 font-num" style={{ color: "var(--st-accent)" }}>{n + 1}</span>{t.title}</button>
                          <button type="button" onClick={() => setOpenTopic(on ? null : t.id)} aria-expanded={on} aria-label={`${on ? "Hide" : "Show"} sections of ${t.title}`} className="mr-1 grid h-7 w-7 shrink-0 place-items-center rounded-full hover:bg-[var(--surface-secondary)]"><ChevronDown className={`h-4 w-4 transition-transform ${on ? "rotate-180" : ""}`} aria-hidden /></button>
                        </div>
                        {on && <ul className="mx-2.5 mb-2 border-l-2 pl-2" style={{ borderColor: "color-mix(in srgb, var(--st-accent) 35%, transparent)" }}>{sectionsOf(t).map((sec) => <li key={sec.key}><button type="button" role="menuitem" onClick={() => { setOpen(false); goTo(secId(t, sec.key)); }} className={`w-full rounded-lg px-2 py-1 text-left text-xs text-[var(--text-secondary)] hover:bg-[var(--surface-secondary)] hover:text-[var(--text-primary)] ${secRow(sec)}`}><SecLabel sec={sec} /></button></li>)}</ul>}
                      </li>
                    );
                  })}</ul>}
                </li>
              );
            })}
          </ol>
        </div>
      </>}
    </div>
  );
}

/* ------------------------------------------------------------------ textbook layout (Topic.book) */
/* A small C syntax colouring for the code editor (colours are fixed: the editor is always dark). */
const C_KW = new Set(["if", "else", "for", "while", "do", "return", "break", "continue", "switch", "case", "default", "sizeof", "struct", "union", "enum", "typedef", "static", "extern", "const", "goto", "NULL"]);
const C_TY = new Set(["void", "int", "char", "float", "double", "long", "short", "unsigned", "signed", "size_t"]);
function colourLine(line: string): ReactNode[] {
  const out: ReactNode[] = []; const re = /(\/\*.*?\*\/|\/\/.*|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|#\s*\w+|\b\d+(?:\.\d+)?\b|\b[A-Za-z_]\w*\b)/g;
  let last = 0, m: RegExpExecArray | null, k = 0;
  while ((m = re.exec(line))) {
    if (m.index > last) out.push(line.slice(last, m.index));
    const w = m[0]; let c = "var(--ce-fg)";
    if (w.startsWith("/*") || w.startsWith("//")) c = "var(--ce-cmt)"; else if (w[0] === '"' || w[0] === "'") c = "var(--ce-str)"; else if (w[0] === "#") c = "var(--ce-pp)";
    else if (/^\d/.test(w)) c = "var(--ce-num)"; else if (C_KW.has(w)) c = "var(--ce-kw)"; else if (C_TY.has(w)) c = "var(--ce-ty)"; else if (line[re.lastIndex] === "(") c = "var(--ce-fn)";
    out.push(<span key={k++} style={{ color: c, fontStyle: c === "var(--ce-cmt)" ? "italic" : undefined }}>{w}</span>); last = re.lastIndex;
  }
  if (last < line.length) out.push(line.slice(last));
  return out;
}
/** Code in an editor frame: line numbers, colours, and NOT selectable or copyable (highlights and notes work on the text around it). */
function CodeEditor({ text, out, name = "main.c" }: { text: string; out?: string; name?: string }) {
  const lines = text.replace(/\n$/, "").split("\n");
  const block = (e: React.SyntheticEvent) => e.preventDefault();
  return (
    <div className="code-ed clear-both my-5 select-none overflow-hidden rounded-xl" style={{ WebkitUserSelect: "none", userSelect: "none" }} onCopy={block} onCut={block} onContextMenu={block} onDragStart={block} data-code="">
      <div className="code-ed-bar flex items-center gap-1.5 px-3 py-2"><span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" /><span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" /><span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" /><span className="ml-3 font-mono text-xs" style={{ color: "var(--ce-gutter)" }}>{name}</span></div>
      <pre className="overflow-x-auto py-3 font-mono text-[0.92rem] leading-6" style={{ color: "var(--ce-fg)" }} aria-label="Code example">{lines.map((l, i) => <div key={i} className="flex"><span className="w-10 shrink-0 pr-3 text-right" style={{ color: "var(--ce-gutter)" }}>{i + 1}</span><span className="whitespace-pre pr-4">{colourLine(l)}</span></div>)}</pre>
      {out !== undefined && <div className="code-ed-out px-3 py-2.5"><p className="mb-1 font-mono text-[10px] font-extrabold uppercase tracking-widest" style={{ color: "var(--ce-out-label)" }}>Output</p><pre className="overflow-x-auto font-mono text-[0.9rem] leading-6" style={{ color: "var(--ce-fg)" }}>{out}</pre></div>}
    </div>
  );
}
const CALLOUT: Record<string, { label: string; tint: string; icon: ReactNode }> = {
  key: { label: "Key idea", tint: "butter", icon: <Lightbulb className="h-4 w-4" aria-hidden /> }, note: { label: "Note", tint: "sky", icon: <BookOpenText className="h-4 w-4" aria-hidden /> },
  trap: { label: "Trap", tint: "rose", icon: <TriangleAlert className="h-4 w-4" aria-hidden /> }, warning: { label: "Warning", tint: "rose", icon: <TriangleAlert className="h-4 w-4" aria-hidden /> },
  remember: { label: "Remember", tint: "mint", icon: <Repeat className="h-4 w-4" aria-hidden /> }, try: { label: "Try it", tint: "peach", icon: <Zap className="h-4 w-4" aria-hidden /> },
  gate: { label: "How GATE asks this", tint: "butter", icon: <Lightbulb className="h-4 w-4" aria-hidden /> },
  tip: { label: "Tip", tint: "mint", icon: <Sparkles className="h-4 w-4" aria-hidden /> }, shortcut: { label: "Shortcut", tint: "mint", icon: <Zap className="h-4 w-4" aria-hidden /> },
  variation: { label: "Variation", tint: "sky", icon: <Repeat className="h-4 w-4" aria-hidden /> },
};
/** Heading numbers: h2 = 10.1, h3 = 10.1.1, h4 = 10.1.1.1, h5 = 10.1.1.1.1 (a deeper level restarts when a shallower one appears). */
function headNumbers(nodes: BookNode[], no: string): Map<number, string> {
  const c = [0, 0, 0, 0]; const out = new Map<number, string>();
  nodes.forEach((n, i) => { if (n.t === "h2" || n.t === "h3" || n.t === "h4" || n.t === "h5") { const d = Number(n.t[1]) - 2; c[d]++; for (let k = d + 1; k < 4; k++) c[k] = 0; out.set(i, `${no}.${c.slice(0, d + 1).join(".")}`); } });
  return out;
}
/** Outline for a textbook topic: every h2 and h3 (the heading elements carry the anchors), then the exercises. */
function bookSections(t: Topic): Sec[] {
  const nodes = t.book ?? []; const nums = headNumbers(nodes, t.no ?? "");
  const out: Sec[] = [];
  nodes.forEach((n, i) => { if (n.t === "h2" || n.t === "h3") out.push({ key: `s${i}`, label: `${nums.get(i)} ${n.text}`, lvl: n.t === "h2" ? 1 : 2 }); });
  out.push({ key: "check", label: "Exercises" });
  return out;
}
function BookTopicView({ t, index, topics, href }: { t: Topic; index: number; topics: Topic[]; href?: string }) {
  const recallMeta = { subject: CS_SHELF.find((bk) => bk.chapters.some((c) => c.href === href))?.title ?? "Study", topic: t.title };
  const no = t.no ?? String(index + 1);
  const nodes = t.book ?? [];
  const nums = headNumbers(nodes, no);
  const figs = new Map((t.blocks.filter((b) => b.type === "figure") as B<"figure">[]).map((b) => [b.id, b]));
  const exs = new Map((t.blocks.filter((b) => b.type === "example") as B<"example">[]).map((b) => [b.id, b]));
  const traps = t.blocks.filter((b) => b.type === "trap") as B<"trap">[];
  const single = <K extends Block["type"]>(k: K) => t.blocks.find((b) => b.type === k) as B<K> | undefined;
  const figNo = new Map<string, number>(); const exNo = new Map<string, number>();
  nodes.forEach((n) => { if (n.t === "fig") figNo.set(n.id, figNo.size + 1); if (n.t === "ex") exNo.set(n.id, exNo.size + 1); });
  const qs = t.blocks.flatMap((b) => (b.type === "check" ? b.questions : []));
  const recall = single("recall"), links = single("links"), practice = single("practice");
  // four heading levels, each its own shape: h2 a numbered banner with a filled badge, h3 a side-barred title, h4 a small-caps label, h5 an italic run-in
  const HEAD = [
    { wrap: "mt-12 flex items-start gap-3 border-b-2 pb-2.5", ws: { borderColor: "color-mix(in srgb, var(--st-accent) 45%, transparent)" }, num: "select-none mt-1 shrink-0 rounded-lg px-2.5 py-0.5 text-[1.05rem] font-extrabold tabular-nums text-[var(--surface)]", ns: { background: "var(--st-accent)" }, text: "font-display text-[1.75rem] font-extrabold leading-tight tracking-tight" },
    { wrap: "mt-9 flex items-start gap-3 border-l-[5px] pl-3.5", ws: { borderColor: "var(--st-accent)" }, num: "select-none mt-0.5 shrink-0 rounded-md border px-2 py-0.5 text-[0.88rem] font-extrabold tabular-nums", ns: { color: "var(--st-accent)", borderColor: "color-mix(in srgb, var(--st-accent) 55%, transparent)", background: "color-mix(in srgb, var(--st-accent) 10%, transparent)" }, text: "text-[1.35rem] font-bold leading-snug" },
    { wrap: "mt-7 flex items-start gap-2.5 border-b border-dotted border-[var(--border)] pb-1", ws: {}, num: "select-none mt-0.5 shrink-0 rounded px-1.5 py-px text-[0.78rem] font-extrabold tabular-nums", ns: { color: "var(--st-accent)", background: "color-mix(in srgb, var(--st-accent) 12%, transparent)" }, text: "text-[0.95rem] font-extrabold uppercase tracking-[.09em]" },
    { wrap: "mt-5 flex items-start gap-2", ws: {}, num: "select-none mt-1 shrink-0 text-xs font-bold tabular-nums", ns: { color: "var(--st-accent)" }, text: "text-base font-semibold italic text-[var(--text-secondary)]" },
  ];
  const firstHead = nodes.findIndex((n) => n.t === "h2" || n.t === "h3"); const leadAt = nodes.findIndex((n) => n.t === "p");
  const render = (n: BookNode, i: number) => {
    if (n.t === "h2" || n.t === "h3" || n.t === "h4" || n.t === "h5") { const d = Number(n.t[1]) - 2; const H = (d === 0 ? "h3" : "h4") as "h3" | "h4"; const w = HEAD[d]; return <H key={i} id={secId(t, `s${i}`)} data-sec="" className={`clear-both scroll-mt-24 text-[var(--text-primary)] lg:scroll-mt-4 ${w.wrap}`} style={w.ws}><span className={w.num} style={w.ns}>{nums.get(i)}</span><span className={w.text}>{n.text}</span></H>; }
    if (n.t === "p" && n.text.startsWith("By the end of this chapter") && nodes[i + 1]?.t === "ul") {
      const goals = nodes[i + 1] as Extract<BookNode, { items: string[] }>;
      return <aside key={i} {...card("mint", "clear-both my-6")}><Label icon={<Target className="h-4 w-4" aria-hidden />}>What you will be able to do</Label><ul className="mt-3 grid gap-2.5 sm:grid-cols-2">{goals.items.map((g, k) => <li key={k} className="flex items-start gap-2.5 text-[0.98rem] leading-7 text-[var(--text-primary)]"><span className="mt-1.5 grid h-5 w-5 shrink-0 place-items-center rounded-full text-[var(--surface)]" style={{ background: "var(--st-accent)" }}><Check className="h-3 w-3" strokeWidth={3} aria-hidden /></span><span><Inline s={g} /></span></li>)}</ul></aside>;
    }
    if (n.t === "ul" && i > 0 && nodes[i - 1].t === "p" && (nodes[i - 1] as Extract<BookNode, { t: "p" }>).text.startsWith("By the end of this chapter")) return null;
    if (n.t === "p") return <p key={i} className={i === leadAt && (firstHead < 0 || i < firstHead) ? "mt-4 border-l-4 pl-4 text-justify text-[1.12rem] font-medium leading-8 text-[var(--text-primary)] hyphens-auto" : "mt-4 text-justify text-[1.05rem] leading-8 text-[var(--text-primary)] hyphens-auto [text-wrap:pretty]"} style={i === leadAt && (firstHead < 0 || i < firstHead) ? { borderColor: "color-mix(in srgb, var(--st-accent) 55%, transparent)" } : undefined}><Inline s={n.text} /></p>;
    if (n.t === "ul" || n.t === "ol") { const L = n.t === "ul" ? "ul" : "ol"; return <L key={i} className={`mt-4 space-y-1.5 pl-7 text-justify text-[1.05rem] leading-8 text-[var(--text-primary)] hyphens-auto ${n.t === "ul" ? "list-disc" : "list-decimal"}`}>{n.items.map((x, k) => <li key={k}><Inline s={x} /></li>)}</L>; }
    if (n.t === "code") return <CodeEditor key={i} text={n.text} out={n.out} name={n.file} />;
    if (n.t === "table") return <div key={i} className="clear-both my-5 overflow-x-auto"><table className="w-full border-collapse text-[0.98rem]"><thead><tr>{n.head.map((h, k) => <th key={k} className="border-b-2 border-[var(--text-primary)] px-3 py-2 text-left font-bold text-[var(--text-primary)]">{h}</th>)}</tr></thead><tbody>{n.rows.map((r, k) => <tr key={k}>{r.map((c, m) => <td key={m} className="border-b border-[var(--border)] px-3 py-2 align-top text-[var(--text-primary)]"><Inline s={c} /></td>)}</tr>)}</tbody></table>{n.caption && <p className="mt-1 text-sm text-[var(--text-secondary)]">{n.caption}</p>}</div>;
    if (n.t === "callout") { const c = CALLOUT[n.kind]; return <aside key={i} {...card(c.tint, "clear-both my-5")}><Label icon={c.icon}>{n.title ?? c.label}</Label><p className="lesson-p mt-1.5"><Inline s={n.text} /></p></aside>; }
    if (n.t === "fig") { const f = figs.get(n.id); if (!f) return null;
      const kind = f.fig.kind === "frames" ? ((f.fig.frames[0]?.fig as { kind?: string } | undefined)?.kind ?? "memory") : f.fig.kind;
      const wide = f.fig.kind === "frames" || !["memory", "stackframe", "ring"].includes(kind);
      const stage = f.fig.kind === "frames" && kind !== "strip" ? "max-w-[640px]" : "max-w-[860px]";
      return <figure key={i} className={`${plain} my-6 grid grid-cols-[minmax(0,1fr)] content-center justify-items-center gap-2 ${wide ? "clear-both w-full" : "lg:float-right lg:clear-right lg:ml-8 lg:w-[50%]"}`}><div className={`w-full ${stage}`}><Diagram fig={f.fig} /></div><figcaption className={`${stage} text-center text-sm leading-6 text-[var(--text-secondary)]`}><b className="text-[var(--text-primary)]">Figure {no}.{figNo.get(n.id)}.</b> <Rich s={f.caption} /></figcaption><span className="sr-only">{f.alt}</span></figure>; }
    if (n.t === "ex") { const e = exs.get(n.id); return e ? <div key={i} className="clear-both my-6"><p className="select-none mb-1.5 text-xs font-extrabold uppercase tracking-wide text-[var(--st-accent)]">Example {no}.{exNo.get(n.id)}</p><Example b={e} code /></div> : null; }
    if (n.t === "trap") { const b = traps[n.i ?? 0]; return b ? <div key={i} className="clear-both my-5"><Trap b={b} /></div> : null; }
    if (n.t === "gate") { const b = single("gate"); return b ? <div key={i} className="clear-both my-5"><Gate b={b} /></div> : null; }
    if (n.t === "shortcut") { const b = single("shortcut"); return b ? <div key={i} className="clear-both my-5"><Shortcut b={b} /></div> : null; }
    if (n.t === "faded") { const b = single("faded"); return b ? <div key={i} className="clear-both my-5"><Faded b={b} /></div> : null; }
    if (n.t === "walk") { const b = single("walkthrough"); return b ? <div key={i} className="clear-both my-5"><Walk b={b} /></div> : null; }
    if (n.t === "lab") return <section key={i} {...card("plain", "clear-both my-6")}><Label icon={<Zap className="h-4 w-4" aria-hidden />}>Try it: lab</Label><div className="mt-3"><PdsPtrLab /></div></section>;
    return null;
  };
  return (
    <article id={t.id} data-topic="" data-book="" lang="en" className="scroll-mt-24 lg:scroll-mt-4">
      <header className="lesson-topic-head flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0"><p className="select-none text-xs font-extrabold uppercase tracking-[.12em] text-[var(--st-accent)]">Chapter {no}</p>
          <h2 className="font-display text-2xl font-extrabold leading-tight text-[var(--text-primary)] sm:text-[2rem]">{t.title}</h2></div>
        <div className="flex flex-wrap items-center gap-2"><TopicNoteButton t={t} meta={recallMeta} /><TopicNav topics={topics} index={index} /></div>
      </header>
      <div className="mt-2 px-1 sm:px-3">
        {nodes.map(render)}
        <div className="clear-both" />
        {(qs.length > 0 || recall) && (
          <Sect t={t} k="check" className="clear-both pb-2">
            <h3 className="clear-both mt-10 border-b-2 border-[var(--text-primary)] pb-1.5 font-display text-[1.6rem] font-extrabold leading-tight text-[var(--text-primary)]">Exercises</h3>
            {qs.length > 0 && <ol className="mt-4 grid gap-4 @5xl:grid-cols-2">{qs.map((q, i) => <CheckQuestion key={q.id} q={q} n={i + 1} />)}</ol>}
            {recall && <div className="mt-6"><Recall b={recall} meta={recallMeta} /></div>}
          </Sect>
        )}
        {(links || practice) && <div className="mt-8 space-y-5">{links && <Links b={links} />}{practice && <Practice b={practice} />}</div>}
        <nav aria-label="Topic navigation" className="mt-8 grid gap-3 sm:grid-cols-2">
          {topics[index - 1] ? <button type="button" onClick={() => goTo(topics[index - 1].id)} className="flex items-center gap-3 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 text-left hover:bg-[var(--surface-secondary)]"><span className="text-xs font-bold text-[var(--text-muted)]">Previous</span><span className="font-bold text-[var(--text-primary)]">{topics[index - 1].title}</span></button> : <span />}
          {topics[index + 1] && <button type="button" onClick={() => goTo(topics[index + 1].id)} className="flex items-center justify-end gap-3 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 text-right hover:bg-[var(--surface-secondary)]"><span className="font-bold text-[var(--text-primary)]">{topics[index + 1].title}</span><span className="text-xs font-bold text-[var(--text-muted)]">Next</span></button>}
        </nav>
      </div>
    </article>
  );
}

function TopicView({ t, index, topics, href }: { t: Topic; index: number; topics: Topic[]; href?: string }) {
  if (t.book) return <BookTopicView t={t} index={index} topics={topics} href={href} />;
  const recallMeta = { subject: CS_SHELF.find((bk) => bk.chapters.some((c) => c.href === href))?.title ?? "Study", topic: t.title };
  const one = <T extends Block["type"]>(k: T) => t.blocks.find((b) => b.type === k) as B<T> | undefined;
  const all = <T extends Block["type"]>(k: T) => t.blocks.filter((b) => b.type === k) as B<T>[];
  const figs = all("figure"), loose = figs.filter((f) => !f.for);
  const deep = one("deep"), lab = one("lab"), practice = one("practice"), hook = one("hook"), obj = one("objectives"), intu = one("intuition"), def = one("definition"), walk = one("walkthrough"), faded = one("faded"), shortcut = one("shortcut"), gate = one("gate"), recall = one("recall"), links = one("links");
  const qs = all("check").flatMap((c) => c.questions);
  return (
    <article id={t.id} data-topic="" className="scroll-mt-24 space-y-5 lg:scroll-mt-4">
      <header className="lesson-topic-head flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0"><p className="select-none text-xs font-extrabold uppercase tracking-[.12em] text-[var(--st-accent)]">Topic {index + 1}</p>
        <h2 className="font-display text-2xl font-extrabold leading-tight text-[var(--text-primary)] sm:text-[2rem]">{t.title}</h2></div>
        <div className="flex flex-wrap items-center gap-2"><TopicNoteButton t={t} meta={recallMeta} /><TopicNav topics={topics} index={index} /></div>
      </header>
      {(hook || obj) && <Sect t={t} k="start" className="grid gap-5 @3xl:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">{hook && <Hook b={hook} />}{obj && <Objectives b={obj} />}</Sect>}
      {(intu || def) && <Sect t={t} k="idea" className="grid gap-5 @3xl:grid-cols-2">{intu && <Intuition b={intu} />}{def && <Definition b={def} />}</Sect>}
      {deep && <Sect t={t} k="deep"><Deep b={deep} /></Sect>}
      {walk && <Sect t={t} k="method" className="grid gap-5 @3xl:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]"><Walk b={walk} />{loose[0] && <Figure b={loose[0]} />}</Sect>}
      {loose.length > 1 && <div className="grid gap-5 @xl:grid-cols-2">{loose.slice(1).map((f) => <Figure key={f.id} b={f} />)}</div>}
      {all("example").map((ex, i) => {
        const own = figs.filter((f) => f.for === ex.id);
        return <Sect key={ex.id} t={t} k={`ex${i}`} className={`grid gap-5 ${own.length ? "@3xl:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]" : ""}`}><Example b={ex} />{own.length > 0 && <div className="grid gap-5">{own.map((f) => <Figure key={f.id} b={f} />)}</div>}</Sect>;
      })}
      {lab && <Sect t={t} k="lab">{lab.lab === "toc-dfa" ? <TocDfaLab /> : lab.lab === "toc-nfa" ? <TocNfaLab /> : lab.lab === "toc-regex" ? <TocRegexLab /> : lab.lab === "toc-min" ? <TocMinLab /> : lab.lab === "toc-product" ? <TocProductLab /> : lab.lab === "toc-pump" ? <TocPumpLab /> : lab.lab === "toc-classify" ? <TocClassifyLab /> : lab.lab === "toc-cfg" ? <TocCfgLab /> : lab.lab === "toc-cyk" ? <TocCykLab /> : lab.lab === "toc-pda" ? <TocPdaLab /> : lab.lab === "toc-cfpump" ? <TocCfPumpLab /> : lab.lab === "toc-cfclass" ? <TocCfClassLab /> : lab.lab === "toc-tm" ? <TocTmLab /> : lab.lab === "toc-recre" ? <TocRecReLab /> : lab.lab === "toc-diag" ? <TocDiagLab /> : lab.lab === "toc-rice" ? <TocRiceLab /> : lab.lab === "toc-decide" ? <TocDecideLab /> : lab.lab === "coa-cachegeo" ? <CoaCacheGeoLab /> : lab.lab === "coa-cachesim" ? <CoaCacheSimLab /> : lab.lab === "coa-amat" ? <CoaAmatLab /> : lab.lab === "isa-opcode" ? <IsaOpcodeLab /> : lab.lab === "isa-modes" ? <IsaModeLab /> : lab.lab === "isa-stack" ? <IsaStackLab /> : lab.lab === "alu" ? <DpAluLab /> : lab.lab === "cycles" ? <DpCycleLab /> : lab.lab === "micro" ? <DpMicroLab /> : lab.lab === "pipe-timing" ? <PipeTimingLab /> : lab.lab === "pipe-hazard" ? <PipeHazardLab /> : lab.lab === "pipe-cpi" ? <PipeCpiLab /> : lab.lab === "mem-design" ? <MmDesignLab /> : lab.lab === "mem-interleave" ? <MmInterleaveLab /> : lab.lab === "mem-disk" ? <MmDiskLab /> : lab.lab === "mem-hamming" ? <MmHammingLab /> : lab.lab === "io-compare" ? <IoCompareLab /> : lab.lab === "io-daisy" ? <IoDaisyLab /> : lab.lab === "io-dma" ? <IoDmaLab /> : lab.lab === "io-bus" ? <IoBusLab /> : lab.lab === "rag" ? <RagLab /> : lab.lab === "prevent" ? <PreventLab /> : lab.lab === "banker" ? <BankerLab /> : lab.lab === "detect" ? <DetectLab /> : lab.lab === "count" ? <CountLab /> : lab.lab === "states" ? <ProcessStateLab /> : lab.lab === "fork" ? <ForkLab /> : lab.lab === "threads" ? <ThreadLab /> : lab.lab === "syscall" ? <SyscallLab /> : lab.lab === "sched" ? <SchedLab /> : lab.lab === "sched-prio" ? <SchedLab initial="PRIO" /> : lab.lab === "race" ? <RaceLab /> : lab.lab === "semaphore" ? <SemaphoreLab /> : lab.lab === "buffer" ? <BufferLab /> : lab.lab === "fit" ? <FitLab /> : lab.lab === "paging" ? <PagingLab /> : lab.lab === "tlb" ? <TlbLab /> : lab.lab === "replace" ? <ReplaceLab /> : lab.lab === "disk" ? <DiskLab /> : lab.lab === "alloc" ? <AllocLab /> : lab.lab === "spanning" ? <Dm3SpanningLab /> : lab.lab === "planar" ? <Dm3PlanarLab /> : lab.lab === "hall" ? <Dm3HallLab /> : lab.lab === "iso" ? <Dm3IsoLab /> : lab.lab === "pigeon" ? <Dm3PigeonLab /> : lab.lab === "pascal" ? <Dm3PascalLab /> : lab.lab === "master" ? <Dm3MasterLab /> : lab.lab === "activity" ? <Algo2ActivityLab /> : lab.lab === "fracknap" ? <Algo2FracKnapLab /> : lab.lab === "huffman" ? <Algo2HuffmanLab /> : lab.lab === "lcs" ? <Algo2LcsLab /> : lab.lab === "knap01" ? <Algo2Knap01Lab /> : lab.lab === "mcm" ? <Algo2McmLab /> : lab.lab === "coins" ? <Algo2CoinsLab /> : lab.lab === "bipartite" ? <Algo2BipartiteLab /> : lab.lab === "topo" ? <Algo2TopoLab /> : lab.lab === "scc" ? <Algo2SccLab /> : lab.lab === "kruskal" ? <Algo2KruskalLab /> : lab.lab === "prim" ? <Algo2PrimLab /> : lab.lab === "mstcount" ? <Algo2MstCountLab /> : lab.lab === "dijkstra" ? <Algo2DijkstraLab /> : lab.lab === "bellman" ? <Algo2BellmanLab /> : lab.lab === "fw" ? <Algo2FwLab /> : lab.lab === "growth" ? <AlgoGrowthLab /> : lab.lab === "rtree" ? <AlgoRecTreeLab /> : lab.lab === "mastert" ? <AlgoMasterLab2 /> : lab.lab === "elemsort" ? <AlgoElemSortLab /> : lab.lab === "merge" ? <AlgoMergeLab /> : lab.lab === "quick" ? <AlgoQuickLab /> : lab.lab === "sortcmp" ? <AlgoSortCmpLab /> : lab.lab === "radix" ? <AlgoRadixLab /> : lab.lab === "chain" ? <AlgoChainLab /> : lab.lab === "openaddr" ? <AlgoOpenAddrLab /> : lab.lab === "probes" ? <AlgoProbesLab /> : lab.lab === "maxmin" ? <AlgoMaxMinLab /> : lab.lab === "mult" ? <AlgoMultLab /> : lab.lab === "select" ? <AlgoSelectLab /> : lab.lab === "ctypes" ? <PdsCTypesLab /> : lab.lab === "loop" ? <PdsLoopLab /> : lab.lab === "ptr" ? <PdsPtrLab /> : lab.lab === "params" ? <PdsParamLab /> : lab.lab === "struct" ? <PdsStructLab /> : lab.lab === "rectrace" ? <PdsRecTraceLab /> : lab.lab === "calls" ? <PdsFibCallsLab /> : lab.lab === "hanoi" ? <PdsHanoiLab /> : lab.lab === "addr" ? <PdsAddrLab /> : lab.lab === "tri" ? <PdsTriLab /> : lab.lab === "bsearch" ? <PdsBsearchLab /> : lab.lab === "stackperm" ? <PdsStackPermLab /> : lab.lab === "postfix" ? <PdsPostfixLab /> : lab.lab === "cqueue" ? <PdsCQueueLab /> : lab.lab === "twostack" ? <PdsTwoStackLab /> : lab.lab === "llist" ? <PdsLListLab /> : lab.lab === "josephus" ? <PdsJosephusLab /> : lab.lab === "floyd" ? <PdsFloydLab /> : lab.lab === "treeprops" ? <PdsTreePropsLab /> : lab.lab === "traverse" ? <PdsTraverseLab /> : lab.lab === "bst" ? <PdsBstLab /> : lab.lab === "avl" ? <PdsAvlLab /> : lab.lab === "heap" ? <PdsHeapLab /> : lab.lab === "heapsort" ? <PdsHeapsortLab /> : lab.lab === "dary" ? <PdsDaryLab /> : lab.lab === "graphrep" ? <PdsGraphRepLab /> : lab.lab === "bfsdfs" ? <PdsBfsDfsLab /> : lab.lab === "graphops" ? <PdsGraphOpsLab /> : lab.lab === "perf" ? <Cn2PerfLab /> : lab.lab === "hamming" ? <Cn2HammingLab /> : lab.lab === "bridge" ? <Cn2BridgeLab /> : lab.lab === "csmaca" ? <Cn2CsmaCaLab /> : lab.lab === "nat" ? <Cn2NatLab /> : lab.lab === "ipv6" ? <Cn2Ipv6Lab /> : lab.lab === "classful" ? <Cn2ClassfulLab /> : lab.lab === "rwnd" ? <Cn2RwndLab /> : lab.lab === "rto" ? <Cn2RtoLab /> : lab.lab === "checksum" ? <Cn2ChecksumLab /> : lab.lab === "dns" ? <Cn2DnsLab /> : lab.lab === "base64" ? <Cn2Base64Lab /> : lab.lab === "webcache" ? <Cn2WebCacheLab /> : lab.lab === "ctxswitch" ? <Os2CtxLab /> : lab.lab === "zombie" ? <Os2ZombieLab /> : lab.lab === "rt" ? <Os2RtLab /> : lab.lab === "pv" ? <Os2PvLab /> : lab.lab === "monitor" ? <Os2MonitorLab /> : lab.lab === "rw" ? <Os2RwLab /> : lab.lab === "dine" ? <Os2DineLab /> : lab.lab === "ptsize" ? <Os2PtSizeLab /> : lab.lab === "buddy" ? <Os2BuddyLab /> : lab.lab === "clock" ? <Os2ClockLab /> : lab.lab === "cow" ? <Os2CowLab /> : lab.lab === "fslinks" ? <Os2FsLinksLab /> : lab.lab === "freespace" ? <Os2FreeSpaceLab /> : lab.lab === "disktime" ? <Os2DiskTimeLab /> : lab.lab === "raid" ? <Os2RaidLab /> : lab.lab === "dma" ? <Os2DmaLab /> : lab.lab === "eer" ? <Db2EerLab /> : lab.lab === "outer" ? <Db2OuterLab /> : lab.lab === "group" ? <Db2GroupLab /> : lab.lab === "nulls" ? <Db2NullLab /> : lab.lab === "decomp" ? <Db2DecompLab /> : lab.lab === "mvd" ? <Db2MvdLab /> : lab.lab === "hash" ? <Db2HashLab /> : lab.lab === "log" ? <Db2LogLab /> : lab.lab === "mgl" ? <Db2MglLab /> : lab.lab === "validate" ? <Db2ValidateLab /> : lab.lab === "er-map" ? <DbErLab /> : lab.lab === "er-extra" ? <DbErExtraLab /> : lab.lab === "keys" ? <DbKeysLab /> : lab.lab === "fk" ? <DbFkLab /> : lab.lab === "ra" ? <DbRaLab /> : lab.lab === "trc" ? <DbTrcLab /> : lab.lab === "sql" ? <DbSqlLab /> : lab.lab === "sql-nested" ? <DbSqlNestedLab /> : lab.lab === "fd" ? <DbFdLab /> : lab.lab === "nf" ? <DbNfLab /> : lab.lab === "index-calc" ? <DbIndexLab /> : lab.lab === "btree" ? <DbBtreeLab /> : lab.lab === "serial" ? <DbSerialLab /> : lab.lab === "recover" ? <DbRecoverLab /> : lab.lab === "2pl" ? <DbTwoPlLab /> : lab.lab === "ts" ? <DbTsLab /> : lab.lab === "argument" ? <Dm2ArgumentLab /> : lab.lab === "complete" ? <Dm2CompleteLab /> : lab.lab === "translate" ? <Dm2TranslateLab /> : lab.lab === "setalg" ? <Dm2SetLab /> : lab.lab === "compose" ? <Dm2ComposeLab /> : lab.lab === "boolean" ? <Dm2AtomLab /> : lab.lab === "cosets" ? <Dm2CosetLab /> : lab.lab === "rr" ? <RrLab /> : lab.lab === "pagefault" ? <PageFaultLab /> : lab.lab === "workingset" ? <WorkingSetLab /> : lab.lab === "truth" ? <DmTruthLab /> : lab.lab === "equiv" ? <DmEquivLab /> : lab.lab === "quant" ? <DmQuantLab /> : lab.lab === "fol" ? <DmFolLab /> : lab.lab === "relation" ? <DmRelationLab /> : lab.lab === "funcs" ? <DmFuncLab /> : lab.lab === "hasse" ? <DmHasseLab /> : lab.lab === "lattice" ? <DmLatticeLab /> : lab.lab === "algebra" ? <DmAlgebraLab /> : lab.lab === "cyclic" ? <DmCyclicLab /> : lab.lab === "graph-basic" ? <DmGraphLab /> : lab.lab === "colour" ? <DmColourLab /> : lab.lab === "count-dm" ? <DmCountLab /> : lab.lab === "derange" ? <DmDerangeLab /> : lab.lab === "recur" ? <DmRecurLab /> : lab.lab === "genfun" ? <DmGenFunLab /> : lab.lab === "sched-hrrn" ? <SchedLab initial="HRRN" /> : lab.lab === "mlfq" ? <MlfqLab /> : lab.lab === "pipe" ? <PipeLab /> : lab.lab === "segment" ? <SegmentLab /> : lab.lab === "encap" ? <EncapLab /> : lab.lab === "delay" ? <DelayLab /> : lab.lab === "crc" ? <CrcLab /> : lab.lab === "window" ? <WindowLab /> : lab.lab === "mac" ? <MacLab /> : lab.lab === "subnet" ? <SubnetLab /> : lab.lab === "frag" ? <FragLab /> : lab.lab === "route" ? <RouteLab /> : lab.lab === "seq" ? <SeqLab /> : lab.lab === "cwnd" ? <CwndLab /> : lab.lab === "http" ? <HttpLab /> : lab.lab === "ports" ? <PortsLab /> : <StarveLab />}</Sect>}
      {(faded || shortcut) && <Sect t={t} k="faded" className={`grid gap-5 ${faded && shortcut ? "@3xl:grid-cols-2" : ""}`}>{faded && <Faded b={faded} />}{shortcut && <Shortcut b={shortcut} />}</Sect>}
      {all("trap").length > 0 && <Sect t={t} k="traps" className="grid gap-5 @xl:grid-cols-2 @5xl:grid-cols-3">{all("trap").map((b, i) => <Trap key={i} b={b} />)}</Sect>}
      {(gate || recall) && <Sect t={t} k="gate" className="grid gap-5 @3xl:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]">{gate && <Gate b={gate} />}{recall && <Recall b={recall} meta={recallMeta} />}</Sect>}
      {qs.length > 0 && <Sect t={t} k="check"><h3 className="lesson-h flex items-center gap-2"><Check className="h-5 w-5" aria-hidden /> Check yourself</h3><ol className="mt-2 grid gap-4 @5xl:grid-cols-2">{qs.map((q, i) => <CheckQuestion key={q.id} q={q} n={i + 1} />)}</ol></Sect>}
      {(links || practice) && <Sect t={t} k="next" className="space-y-5">{links && <Links b={links} />}{practice && <Practice b={practice} />}</Sect>}
      <nav aria-label="Topic navigation" className="grid gap-3 sm:grid-cols-2">
        {topics[index - 1] ? <button type="button" onClick={() => goTo(topics[index - 1].id)} className="flex items-center gap-3 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 text-left hover:bg-[var(--surface-secondary)]"><ChevronLeft className="h-5 w-5 shrink-0" aria-hidden /><span className="min-w-0"><span className="block text-xs font-bold text-[var(--text-secondary)]">Previous topic</span><span className="block font-bold">{topics[index - 1].title}</span></span></button> : <span />}
        {topics[index + 1] && <button type="button" onClick={() => goTo(topics[index + 1].id)} className="flex items-center justify-end gap-3 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 text-right hover:bg-[var(--surface-secondary)]"><span className="min-w-0"><span className="block text-xs font-bold text-[var(--text-secondary)]">Next topic</span><span className="block font-bold">{topics[index + 1].title}</span></span><ChevronRight className="h-5 w-5 shrink-0" aria-hidden /></button>}
      </nav>
    </article>
  );
}

/* ------------------------------------------------------------------ split view (wide screens) */
/** The split pane's own contents rail, styled like the main rail: numbered topic cards that open to their sections. */
function PaneRail({ topics }: { topics: Topic[] }) {
  const [openId, setOpenId] = useState<string | null>(topics[0]?.id ?? null);
  return (
    <nav aria-label="Contents of the second chapter" className="custom-scrollbar min-h-0 w-60 shrink-0 space-y-2 overflow-y-auto border-r border-[var(--border)] p-3">
      {topics.map((t, i) => {
        const on = openId === t.id;
        return (
          <div key={t.id}>
            <button type="button" onClick={() => { setOpenId(on ? null : t.id); goTo(t.id); }} aria-expanded={on} className={`flex w-full items-start gap-2 rounded-xl border-2 px-2 py-2 text-left ${on ? "border-[var(--st-accent)]" : "border-dashed border-[var(--border)] hover:border-[var(--text-secondary)]"}`}>
              <span className={`grid h-6 min-w-6 shrink-0 px-1 place-items-center rounded-full text-[11px] font-bold ${on ? "bg-[var(--st-accent)] text-[var(--surface)]" : "border-2 border-[var(--st-accent)] text-[var(--st-accent)]"}`}>{t.no ?? i + 1}</span>
              <span className="min-w-0 flex-1 text-sm font-bold leading-snug text-[var(--text-primary)]">{t.title}</span>
              <ChevronDown className={`mt-0.5 h-4 w-4 shrink-0 text-[var(--text-secondary)] transition-transform ${on ? "rotate-180" : ""}`} aria-hidden />
            </button>
            {on && <ul className="ml-4 mt-1 space-y-0.5 border-l-2 border-[var(--border)] pl-2">{sectionsOf(t).map((sec) => <li key={sec.key}><button type="button" onClick={() => goTo(secId(t, sec.key))} className={`w-full rounded-lg px-2 py-1 text-left text-xs text-[var(--text-secondary)] hover:bg-[var(--surface-secondary)] hover:text-[var(--text-primary)] ${secRow(sec)}`}><SecLabel sec={sec} /></button></li>)}</ul>}
          </div>
        );
      })}
    </nav>
  );
}

function SplitPane({ href, onClose }: { href: string; onClose: () => void }) {
  const [rail, setRail] = useState(true);
  const [loaded, setLoaded] = useState<{ href: string; ch: Chapter } | null>(null);
  useEffect(() => { let live = true; CHAPTERS[href]?.().then((c) => { if (live) setLoaded({ href, ch: c }); }); return () => { live = false; }; }, [href]);
  const ch = loaded?.href === href ? loaded.ch : null;
  if (!ch) return <section aria-label="Loading the second chapter" className="min-h-0 min-w-0 animate-pulse rounded-[22px] border border-[var(--border)] bg-[var(--surface)]/60" />;
  return (
    <section aria-label={`Beside: ${ch.subject}, ${ch.title}`} className="flex min-h-0 min-w-0 flex-col rounded-[22px] border border-[var(--border)] bg-[var(--surface)]/60">
      <header className="flex shrink-0 items-center gap-2 border-b border-[var(--border)] px-4 py-2.5">
        <span className="min-w-0 flex-1"><span className="block text-[10px] font-extrabold uppercase tracking-[.14em] text-[var(--text-secondary)]">{ch.subject}</span><span className="block truncate font-display text-base font-extrabold text-[var(--text-primary)]">{ch.title}</span></span>
        <button type="button" onClick={() => setRail((x) => !x)} aria-pressed={rail} className="inline-flex h-9 items-center gap-1.5 rounded-full border border-[var(--border)] bg-[var(--surface)] px-3 text-sm font-bold hover:bg-[var(--surface-secondary)]"><ListTree className="h-4 w-4" aria-hidden /> Contents</button>
        <Link href={href} aria-label={`Open ${ch.title} on its own`} className="grid h-8 w-8 place-items-center rounded-full hover:bg-[var(--surface-secondary)]"><ExternalLink className="h-4 w-4" /></Link>
        <button type="button" onClick={onClose} aria-label="Close split view" className="grid h-8 w-8 place-items-center rounded-full hover:bg-[var(--surface-secondary)]"><XIcon className="h-4 w-4" /></button>
      </header>
      <div className="flex min-h-0 flex-1">
        {rail && <PaneRail topics={ch.topics} />}
        <div className="@container custom-scrollbar relative min-h-0 min-w-0 flex-1 space-y-12 overflow-y-auto p-4">
          {ch.topics.map((t, i) => <LazyTopic key={t.id} t={t} index={i} topics={ch.topics} href={href} />)}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ chapter */
export function LessonRenderer({ chapter, backHref = "/study" }: { chapter: Chapter; backHref?: string }) {
  const { attach, toolbar, list, listBar, count, items } = useLessonHighlights(chapter.id);
  // the rail lists every written topic (not the chapter's summary map, which can lag behind new topics); map subtitles are kept where they line up
  const mapItems = chapter.map.kind === "strip" ? chapter.map.items : [];
  const steps = chapter.topics.map((t, i) => ({ label: `${i + 1}. ${t.title}`, sub: mapItems.length === chapter.topics.length ? mapItems[i]?.sub : undefined, state: "done" as const }));
  const pane = useRef<HTMLDivElement | null>(null);
  const [current, setCurrent] = useState<string>("");
  const [soon, setSoon] = useState<number | null>(null);
  const [open, setOpen] = useState<Record<string, boolean>>({});
  const [fold, setFold] = useState<Record<string, boolean>>({}); // `${topic}:${section}` true = the sub-sections of that section are hidden
  const [sheet, setSheet] = useState(false);
  const [sheetHost, setSheetHost] = useState<HTMLElement | null>(null);
  // eslint-disable-next-line react-hooks/set-state-in-effect -- the portal target exists only after mount
  useEffect(() => setSheetHost(document.body), []);
  const split = useStudyTabs((x) => x.split);
  const setSplit = useStudyTabs((x) => x.setSplit);
  const [wide, setWide] = useState(false);
  const [splitW, setSplitW] = useState(55); // % of the reading area for the current chapter
  const focus = useFocusStore((s) => s.on);
  const [railShut, setRailShut] = useState<boolean | null>(null); // null = automatic (folded while split)
  useEffect(() => { const m = window.matchMedia("(min-width: 1280px)"); const f = () => setWide(m.matches); f(); m.addEventListener("change", f); return () => m.removeEventListener("change", f); }, []);
  const dragSplit = (e: React.PointerEvent<HTMLDivElement>) => {
    const box = (e.currentTarget.parentElement as HTMLElement).getBoundingClientRect();
    const move = (ev: PointerEvent) => setSplitW(Math.min(72, Math.max(30, ((ev.clientX - box.left) / box.width) * 100)));
    document.body.style.userSelect = "none"; window.getSelection()?.removeAllRanges();
    const up = () => { document.body.style.userSelect = ""; window.removeEventListener("pointermove", move); window.removeEventListener("pointerup", up); };
    window.addEventListener("pointermove", move); window.addEventListener("pointerup", up);
  };
  // hide the floating tools while the contents sheet is open on a phone
  useEffect(() => { if (sheet) document.body.dataset.lessonSheet = "1"; else delete document.body.dataset.lessonSheet; return () => { delete document.body.dataset.lessonSheet; }; }, [sheet]);
  const railRef = useRef<HTMLOListElement | null>(null);
  // keep the outline on the reader's place: scroll the active section (or its topic) into the middle of the rail
  useEffect(() => {
    const rail = railRef.current; if (!rail || !current) return;
    const el = rail.querySelector<HTMLElement>('[aria-current="location"]'); if (!el) return;
    const r = el.getBoundingClientRect(), b = rail.getBoundingClientRect();
    if (r.top < b.top + 40 || r.bottom > b.bottom - 40) rail.scrollTo({ top: rail.scrollTop + (r.top - b.top) - b.height / 2 + r.height / 2, behavior: Math.abs(r.top - b.top - b.height / 2) > b.height ? "auto" : "smooth" });
  }, [current]);
  const bind = (el: HTMLDivElement | null) => { pane.current = el; attach(el); };
  const href = usePathname() ?? "/study";
  const tab = useMemo(() => ({ href, title: chapter.title, subject: chapter.subject, tint: CS_SHELF.find((b) => b.chapters.some((c) => c.href === href))?.tint }), [href, chapter.title, chapter.subject]);
  // the page panel and navbar take the book colour from the URL (lib/study/catalog bookTintFor), so nothing flashes
  // each tab returns to where you were reading
  useEffect(() => {
    const el = pane.current; if (!el) return;
    const top = recallScroll(href); if (top) requestAnimationFrame(() => { el.scrollTop = top; });
    let raf = 0;
    const on = () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(() => rememberScroll(href, el.scrollTop)); };
    el.addEventListener("scroll", on, { passive: true });
    return () => { el.removeEventListener("scroll", on); cancelAnimationFrame(raf); };
  }, [href]);

  // follow the reader: the last section whose top has passed the upper third of the visible reading area
  useEffect(() => {
    const root = pane.current;
    if (!root) return;
    const scroller: HTMLElement = getComputedStyle(root).overflowY === "auto" ? root : (document.getElementById("app-scroll") ?? document.documentElement);
    let raf = 0, rebuildTimer: ReturnType<typeof setTimeout> | null = null;
    // Positions of every section and topic are measured once (and again when the content changes size or a topic is drawn), not on every scroll
    // step: reading layout on each scroll event forced the browser to re-layout the whole long chapter and made scrolling stutter.
    let els: HTMLElement[] = [], tops: number[] = [], topicTops: number[] = [], topicFirst: number[] = [];
    const rebuild = () => {
      const sb = scroller.getBoundingClientRect(), st = scroller.scrollTop;
      els = [...root.querySelectorAll<HTMLElement>("[data-sec]")];
      tops = els.map((e) => e.getBoundingClientRect().top - sb.top + st);
      const topics = [...root.querySelectorAll<HTMLElement>("[data-topic]")];
      topicTops = topics.map((e) => e.getBoundingClientRect().top - sb.top + st);
      topicFirst = topics.map((tp) => { const f = tp.querySelector<HTMLElement>("[data-sec]"); return f ? els.indexOf(f) : -1; });
    };
    const later = () => { if (rebuildTimer) clearTimeout(rebuildTimer); rebuildTimer = setTimeout(() => { rebuild(); pick(); }, 160); };
    const pick = () => {
      if (!els.length) rebuild();
      if (!els.length) return;
      const line = scroller.scrollTop + scroller.clientHeight * 0.33;
      let lo = 0, hi = els.length - 1, ci = 0;
      while (lo <= hi) { const m = (lo + hi) >> 1; if (tops[m] <= line) { ci = m; lo = m + 1; } else hi = m - 1; }
      // a topic whose heading has passed the line is the current one, even while its first section is still below it (the heading is sticky)
      for (let k = 0; k < topicTops.length; k++) { if (topicTops[k] > line) break; if (topicFirst[k] > ci) ci = topicFirst[k]; }
      const cur = els[ci]; if (cur) setCurrent((c) => (c === cur.id ? c : cur.id));
    };
    const on = () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(pick); };
    scroller.addEventListener("scroll", on, { passive: true });
    const ro = new ResizeObserver(later); ro.observe(root);
    const mo = new MutationObserver(later); mo.observe(root, { childList: true, subtree: true });
    window.addEventListener("resize", later);
    rebuild(); pick();
    return () => { scroller.removeEventListener("scroll", on); window.removeEventListener("resize", later); ro.disconnect(); mo.disconnect(); if (rebuildTimer) clearTimeout(rebuildTimer); cancelAnimationFrame(raf); };
  }, [chapter]);

  const go = (id: string) => {
    const el = document.getElementById(id);
    if (!el) { setSheet(false); setTimeout(() => goTo(id), sheet ? 80 : 0); setCurrent(id); return; } // topic not drawn yet
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const wasSheet = sheet;
    const far = Math.abs(el.getBoundingClientRect().top) > window.innerHeight * 1.2;
    setSheet(false);
    // after the sheet has closed (its re-render would interrupt a smooth scroll)
    setTimeout(() => el.scrollIntoView({ behavior: reduce || wasSheet || far ? "auto" : "smooth", block: "start" }), wasSheet ? 80 : 0);
    setCurrent(id);
  };

  const other = split && split.includes(href) ? (split[0] === href ? split[1] : split[0]) : null;
  const splitHref = wide && other && CHAPTERS[other] ? other : null;
  const folded = (railShut ?? !!splitHref);
  const topicIdx = Math.max(0, chapter.topics.findIndex((x) => current.startsWith(`${x.id}--`)));
  const written = chapter.topics.length;
  const outlineInner = (
    <>
        <div className="shrink-0 pb-3">
        {sheet && <button type="button" onClick={() => setSheet(false)} className="float-right grid h-9 w-9 place-items-center rounded-full border border-[var(--border)] lg:hidden" aria-label="Close contents"><ChevronDown className="h-4 w-4" /></button>}
        <p className="text-[11px] font-extrabold uppercase tracking-[.14em] text-[var(--st-accent)]">{chapter.subject}</p>
        <p className="font-display text-2xl font-extrabold text-[var(--text-primary)]">{chapter.title}</p>
        <ChapterNav href={href} chapter={chapter} />
        <div className="mt-3 flex items-center gap-2">
          <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-[var(--surface-secondary)]"><div className="h-full rounded-full transition-all duration-500" style={{ width: `${((topicIdx + 1) / Math.max(1, written)) * 100}%`, background: "var(--st-accent)" }} /></div>
          <span className="font-num text-[11px] font-bold text-[var(--st-accent)]">Topic {topicIdx + 1}/{written}</span>
          <button type="button" onClick={() => setRailShut(true)} aria-label="Fold the outline" title="Fold the outline" className="hidden h-7 w-7 place-items-center rounded-full text-[var(--text-secondary)] hover:bg-[var(--surface-secondary)] lg:grid"><ChevronsLeft className="h-4 w-4" /></button>
        </div>
        </div>
        <ol ref={railRef} className="no-scrollbar min-h-0 space-y-2 lg:flex-1 lg:overflow-y-auto lg:pr-2">
          {steps.map((s, i) => {
            const t = chapter.topics[i];
            if (!t) return (
              <li key={i}>
                <button type="button" onClick={() => setSoon((x) => (x === i ? null : i))} aria-expanded={soon === i}
                  className="flex w-full items-start gap-3 rounded-xl border-2 border-dashed border-[var(--border)] px-2 py-2 text-left transition-colors hover:border-[var(--text-secondary)]">
                  <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full border-2 border-[var(--border)] text-[11px] font-bold text-[var(--text-secondary)]">{i + 1}</span>
                  <span className="min-w-0"><span className="block text-sm font-bold text-[var(--text-secondary)]">{s.label.replace(/^\d+\.\s*/, "")}</span><span className="block text-xs text-[var(--text-muted,var(--text-secondary))]">{s.sub}</span></span>
                </button>
                {soon === i && <p className="mx-2 mb-1 rounded-xl bg-[var(--surface-secondary)] px-3 py-2 text-xs text-[var(--text-secondary)]">Being written. It opens here as soon as it passes review.</p>}
              </li>
            );
            const secs = sectionsOf(t);
            const curIdx = Math.max(0, chapter.topics.findIndex((x) => current.startsWith(`${x.id}--`)));
            const inTopic = i === curIdx;
            const passed = i < curIdx;
            const expanded = open[t.id] ?? inTopic;
            return (
              <li key={i}>
                <div className={`flex w-full items-start gap-2 rounded-xl border-2 px-2 py-2 transition-colors ${inTopic ? "border-[var(--st-accent)]" : passed ? "border-dashed border-[var(--st-accent)] bg-[color-mix(in_srgb,var(--st-accent)_7%,transparent)]" : "border-dashed border-[var(--border)] hover:border-[var(--text-secondary)]"}`}>
                  <button type="button" onClick={() => { setOpen((x) => ({ ...x, [t.id]: true })); go(t.id); }} className="flex min-w-0 flex-1 items-start gap-3 text-left">
                    <span className={`mt-0.5 grid h-6 min-w-6 shrink-0 px-1 place-items-center rounded-full text-[11px] font-bold ${passed ? "border-2 border-[var(--st-accent)] text-[var(--st-accent)]" : "bg-[var(--st-accent)] text-[var(--surface)]"}`}>{passed ? <Check className="h-3.5 w-3.5" aria-label="Read" /> : (t.no ?? i + 1)}</span>
                    <span className="min-w-0"><span className="block text-sm font-bold text-[var(--text-primary)]">{s.label.replace(/^\d+\.\s*/, "")}</span><span className="block text-xs text-[var(--text-secondary)]">{passed ? "Read" : s.sub}</span></span>
                  </button>
                  <button type="button" onClick={() => setOpen((x) => ({ ...x, [t.id]: !expanded }))} aria-expanded={expanded} aria-label={`${expanded ? "Hide" : "Show"} sections of ${s.label}`} className="grid h-7 w-7 shrink-0 place-items-center rounded-full text-[var(--text-secondary)] hover:bg-[var(--surface-secondary)]"><ChevronDown className={`h-4 w-4 transition-transform ${expanded ? "rotate-180" : ""}`} /></button>
                </div>
                {expanded && <ol className="ml-5 mt-1 border-l-2 border-[var(--border)] py-1">
                  {(() => {
                    const parentOf: Record<string, string> = {}; let cur = "";
                    secs.forEach((x) => { if (x.lvl === 1) cur = x.key; else if (x.lvl === 2) parentOf[x.key] = cur; });
                    const hasKids = new Set(Object.values(parentOf));
                    return secs.map((x) => {
                    const id = secId(t, x.key); const on = current === id;
                    const folded = !!fold[t.id + ":" + x.key]; const toggle = x.lvl === 1 && hasKids.has(x.key);
                    if (x.lvl === 2 && fold[t.id + ":" + parentOf[x.key]] && !on) return null;
                    return (
                      <li key={x.key} className={toggle ? "flex items-center" : undefined}>
                        <button type="button" onClick={() => go(id)} aria-current={on ? "location" : undefined}
                          className={`relative -ml-[2px] block w-full border-l-2 ${x.lvl === 2 ? "py-1 pl-8 pr-2 text-[12px] before:absolute before:left-[1.05rem] before:top-0 before:h-1/2 before:w-3 before:rounded-bl-md before:border-b before:border-l before:border-[var(--border)]" : x.lvl === 1 ? "mt-1.5 py-1.5 pl-3 pr-2 text-[13.5px] font-extrabold" : "py-1.5 pl-3 pr-2 text-[13px]"} text-left leading-snug transition-colors ${on ? "border-[var(--st-accent)] font-bold text-[var(--text-primary)]" : "border-transparent text-[var(--text-secondary)] hover:border-[var(--text-secondary)] hover:text-[var(--text-primary)]"}`}>
                          {on && <span aria-hidden className="absolute inset-0 rounded-r-lg" style={{ background: "color-mix(in srgb, var(--st-accent) 10%, transparent)" }} />}
                          <span className="relative block"><SecLabel sec={x} /></span>
                        </button>
                        {toggle && <button type="button" onClick={() => setFold((z) => ({ ...z, [t.id + ":" + x.key]: !folded }))} aria-expanded={!folded} aria-label={(folded ? "Show" : "Hide") + " the sub-sections of " + x.label} className="mt-1.5 grid h-6 w-6 shrink-0 place-items-center rounded-full text-[var(--text-secondary)] hover:bg-[var(--surface-secondary)]"><ChevronDown className={"h-3.5 w-3.5 transition-transform " + (folded ? "-rotate-90" : "")} /></button>}
                      </li>
                    );
                  });
                  })()}
                </ol>}
              </li>
            );
          })}
        </ol>
    </>
  );
  return (
    <div data-subject={chapter.subject} className={`study-lesson grid grid-cols-[minmax(0,1fr)] gap-6 lg:h-[calc(100dvh-var(--lesson-chrome,10.5rem))] lg:grid-rows-[auto_minmax(0,1fr)] lg:gap-y-2 ${folded ? "lg:grid-cols-[3.5rem_minmax(0,1fr)] lg:gap-x-4" : "lg:grid-cols-[17rem_minmax(0,1fr)] lg:gap-x-8"}`} style={{ ["--st-accent" as string]: tab.tint ? `var(--tint-${tab.tint}-ink)` : "#c2410c", ...(focus ? { ["--lesson-chrome" as string]: "1.5rem" } : {}) }}>
      {!focus && <div className="flex min-w-0 items-end gap-2 lg:col-span-2"><Link href={backHref} aria-label="Back to all books" title="Back to all books" className="pill-ink mb-1 inline-flex !h-9 shrink-0 items-center gap-1.5 !px-2.5 sm:!h-10 sm:!px-4" style={{ ["--btn" as string]: "var(--st-accent)" }}><ArrowLeft className="h-4 w-4" aria-hidden /><span className="hidden sm:inline">Books</span></Link><div className="min-w-0 flex-1"><StudyTabs current={tab} /></div></div>}
      {/* phones: a sticky bar shows where you are; the outline opens as a bottom sheet */}
      <div className="sticky top-0 z-30 -mx-1 flex items-center gap-2 rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2 shadow-[0_8px_20px_-14px_rgba(0,0,0,.4)] lg:hidden">
        <span className="min-w-0 flex-1"><span className="block text-[10px] font-extrabold uppercase tracking-[.14em] text-[var(--st-accent)]">{chapter.subject} · {chapter.title}</span><span className="block truncate text-sm font-bold text-[var(--text-primary)]">{(() => { const t = chapter.topics.find((x) => current.startsWith(`${x.id}--`)) ?? chapter.topics[0]; const sec = t ? sectionsOf(t).find((x) => secId(t, x.key) === current) : null; return sec ? sec.label : t?.title; })()}</span></span>
        <button type="button" onClick={() => setSheet(true)} className="pill-ink !h-9 shrink-0 !px-3" style={{ ["--btn" as string]: "var(--st-accent)" }}>Contents</button>
      </div>
      {folded && (
        <div className="hidden min-h-0 flex-col items-center gap-2 lg:flex">
          <button type="button" onClick={() => setRailShut(false)} aria-label="Unfold the outline" title="Unfold the outline" className="grid h-9 w-9 place-items-center rounded-full border border-[var(--border)] bg-[var(--surface)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]"><ChevronsRight className="h-4 w-4" /></button>
          <div className="relative flex flex-1 flex-col items-center gap-2 py-2">
            <span aria-hidden className="absolute bottom-2 top-2 w-1 rounded-full bg-[var(--surface-secondary)]"><span className="block w-full rounded-full transition-all duration-500" style={{ height: `${((topicIdx + 1) / Math.max(1, written)) * 100}%`, background: "var(--st-accent)" }} /></span>
            {chapter.topics.map((t, i) => (
              <button key={t.id} type="button" onClick={() => go(t.id)} aria-label={`Topic ${i + 1}: ${t.title}`} title={t.title}
                className={`relative z-10 grid h-8 w-8 place-items-center rounded-full text-xs font-bold ${i === topicIdx ? "bg-[var(--st-accent)] text-[var(--surface)]" : i < topicIdx ? "border-2 border-[var(--st-accent)] bg-[var(--surface)] text-[var(--st-accent)]" : "border-2 border-dashed border-[var(--border)] bg-[var(--surface)] text-[var(--text-secondary)]"}`}>
                {i < topicIdx ? <Check className="h-3.5 w-3.5" /> : i + 1}
              </button>
            ))}
          </div>
        </div>
      )}
      <nav aria-label="Chapter outline" className={`${folded ? "lg:!hidden" : ""} relative hidden min-h-0 flex-col lg:flex`}>
{outlineInner}      </nav>
      {sheet && sheetHost && createPortal(
        <>
          <div aria-hidden className="fixed inset-0 z-[600] bg-black/40 lg:hidden" onClick={() => setSheet(false)} />
          <nav aria-label="Chapter outline" className="fixed inset-x-2 bottom-[calc(5.75rem+env(safe-area-inset-bottom))] z-[610] flex max-h-[68dvh] flex-col overflow-y-auto rounded-3xl bg-[var(--surface)] p-4 shadow-2xl lg:hidden" style={{ ["--st-accent" as string]: tab.tint ? `var(--tint-${tab.tint}-ink)` : "#c2410c" }}>
{outlineInner}          </nav>
        </>, sheetHost)}
      <div className={splitHref ? "grid min-h-0 min-w-0 gap-0" : "contents"} style={splitHref ? { gridTemplateColumns: `minmax(0,${splitW}fr) 14px minmax(0,${100 - splitW}fr)`, gridTemplateRows: "minmax(0,1fr)" } : undefined}>
      <div ref={bind} className="@container no-scrollbar relative min-w-0 space-y-14 lg:overflow-y-auto lg:overscroll-contain lg:px-3 lg:pb-28 lg:pt-2">
        {chapter.topics.map((t, i) => <LazyTopic key={t.id} t={t} index={i} topics={chapter.topics} href={href} />)}
      </div>
      {splitHref && <>
        <div role="separator" aria-orientation="vertical" aria-label="Drag to resize the two chapters" tabIndex={0} onPointerDown={dragSplit}
          onKeyDown={(e) => { if (e.key === "ArrowLeft") setSplitW((w) => Math.max(30, w - 4)); if (e.key === "ArrowRight") setSplitW((w) => Math.min(72, w + 4)); }}
          className="group flex cursor-col-resize items-center justify-center"><span className="h-16 w-1.5 rounded-full bg-[var(--border)] transition-colors group-hover:bg-[var(--st-accent)] group-focus-visible:bg-[var(--st-accent)]" /></div>
        <SplitPane href={splitHref} onClose={() => setSplit(null)} />
      </>}
      </div>
      <LessonTools lesson={`${chapter.subject}: ${chapter.title}`} section={chapter.topics.find((t) => current.startsWith(`${t.id}--`))?.title ?? chapter.topics[0]?.title ?? chapter.title} pyqTopic={chapter.pyqTopic} notes={list} notesBar={listBar} noteCount={count} noteItems={items} />
      {toolbar}
    </div>
  );
}
