import React, { useState } from 'react';
import {
  ChevronLeft,
  Package,
  Smartphone,
  CloudUpload,
  CheckCircle2,
  Share2,
  Download,
  Check,
  Sparkles,
} from 'lucide-react';
import { Project, ApkConfig } from '../types';
import { generateProjectZip, generateAndroidApk, triggerDownload } from '../utils/apkGenerator';

interface PublishModalProps {
  project: Project;
  onClose: () => void;
}

type PublishStep = 'options' | 'pack_zip' | 'apk_step1' | 'apk_step2' | 'apk_building' | 'apk_success';

export const PublishModal: React.FC<PublishModalProps> = ({ project, onClose }) => {
  const [step, setStep] = useState<PublishStep>('options');
  const [selectedPublishMethod, setSelectedPublishMethod] = useState<'zip' | 'apk' | 'ideessky'>('apk');

  // Pack Zip State
  const [zipFileName, setZipFileName] = useState(`${project.name}.zip`);
  const [compressionLevel, setCompressionLevel] = useState('Normal');

  // APK Config State
  const [apkConfig, setApkConfig] = useState<ApkConfig>({
    appName: project.name,
    packageName: `com.apdweb.${project.name.toLowerCase().replace(/[^a-z0-9]/g, '') || 'app'}`,
    versionCode: '1',
    versionName: '1.0',
    homepage: project.settings.homepage || 'index.html',
    icon: project.icon || '🌐',
    splashScreen: project.settings.splashPage || 'splash.html',
    minSdkVersion: '21 (Android 5.0)',
    targetSdkVersion: '33 (Android 13)',
  });

  const [buildStepText, setBuildStepText] = useState('Packaging web assets...');
  const [buildProgress, setBuildProgress] = useState(20);
  const [generatedApkBlob, setGeneratedApkBlob] = useState<Blob | null>(null);

  const handlePackZip = async () => {
    try {
      const blob = await generateProjectZip(project);
      triggerDownload(blob, zipFileName);
      onClose();
    } catch (e) {
      alert('Failed to pack project: ' + e);
    }
  };

  const handleStartApkBuild = async () => {
    setStep('apk_building');
    setBuildProgress(25);
    setBuildStepText('Compiling HTML, CSS, JavaScript assets...');

    setTimeout(() => {
      setBuildProgress(50);
      setBuildStepText('Generating AndroidManifest.xml & Gradle configuration...');
    }, 800);

    setTimeout(() => {
      setBuildProgress(75);
      setBuildStepText('Signing APK with release keystore...');
    }, 1600);

    setTimeout(async () => {
      try {
        const apkBlob = await generateAndroidApk(project, apkConfig);
        setGeneratedApkBlob(apkBlob);
        setBuildProgress(100);
        setStep('apk_success');
      } catch (err) {
        alert('Build error: ' + err);
        setStep('options');
      }
    }, 2400);
  };

  const handleDownloadGeneratedApk = () => {
    if (generatedApkBlob) {
      triggerDownload(generatedApkBlob, `${apkConfig.appName.replace(/\s+/g, '_')}-release.apk`);
    }
  };

  const handleShareApk = async () => {
    if (navigator.share && generatedApkBlob) {
      try {
        const file = new File([generatedApkBlob], `${apkConfig.appName}.apk`, {
          type: 'application/vnd.android.package-archive',
        });
        await navigator.share({
          title: apkConfig.appName,
          text: `Download ${apkConfig.appName} APK built with Apd Web IDE!`,
          files: [file],
        });
      } catch (err) {
        handleDownloadGeneratedApk();
      }
    } else {
      handleDownloadGeneratedApk();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 select-none">
      <div className="w-full max-w-sm bg-slate-900 border border-slate-700 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh]">
        {/* Screen 11: Publish Options */}
        {step === 'options' && (
          <div className="flex flex-col flex-1">
            <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between">
              <h2 className="text-base font-bold text-white">How to publish?</h2>
              <button onClick={onClose} className="text-slate-400 hover:text-white p-1">
                ✕
              </button>
            </div>

            <div className="p-5 space-y-3 flex-1 overflow-y-auto">
              {/* Option 1: Pack to Compressed File */}
              <div
                onClick={() => setStep('pack_zip')}
                className="bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 hover:border-emerald-500/60 rounded-2xl p-4 flex items-center justify-between cursor-pointer transition shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-700/80 text-emerald-400 flex items-center justify-center">
                    <Package className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-100">Pack to Compressed File</h3>
                    <p className="text-[11px] text-slate-400">Zip archive of project files</p>
                  </div>
                </div>
              </div>

              {/* Option 2: Convert to Android Application */}
              <div
                onClick={() => setStep('apk_step1')}
                className="bg-emerald-950/20 border border-emerald-500/50 rounded-2xl p-4 flex items-center justify-between cursor-pointer transition shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center">
                    <Smartphone className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">Convert to Android Application</h3>
                    <p className="text-[11px] text-emerald-400">Build real standalone Android APK</p>
                  </div>
                </div>
                <div className="w-5 h-5 rounded bg-emerald-500 flex items-center justify-center text-white">
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </div>
              </div>

              {/* Option 3: Upload to ideessky */}
              <div
                onClick={() => alert('Uploading to ideessky cloud deployment... (Simulated)')}
                className="bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 rounded-2xl p-4 flex items-center justify-between cursor-pointer transition opacity-70"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-700/80 text-sky-400 flex items-center justify-center">
                    <CloudUpload className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-200">Upload to ideessky</h3>
                    <p className="text-[11px] text-slate-400">Cloud web hosting</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Screen 12: Pack to Compressed File */}
        {step === 'pack_zip' && (
          <div className="flex flex-col flex-1">
            <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setStep('options')}
                  className="p-1 hover:bg-slate-800 rounded-full text-slate-300 hover:text-white transition"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <h2 className="text-sm font-bold text-white">Pack to Compressed File</h2>
              </div>
              <button onClick={onClose} className="text-slate-400 hover:text-white p-1">
                ✕
              </button>
            </div>

            <div className="p-5 space-y-4 flex-1 overflow-y-auto">
              <div>
                <label className="block text-[11px] text-slate-400 font-semibold mb-1">
                  File Name
                </label>
                <input
                  type="text"
                  value={zipFileName}
                  onChange={(e) => setZipFileName(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-[11px] text-slate-400 font-semibold mb-1">
                  Location
                </label>
                <p className="text-xs font-mono text-slate-300 bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                  /storage/emulated/0/ApdWeb/backup/
                </p>
              </div>

              <div>
                <label className="block text-[11px] text-slate-400 font-semibold mb-1">
                  Compression Level
                </label>
                <select
                  value={compressionLevel}
                  onChange={(e) => setCompressionLevel(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-xs text-white"
                >
                  <option value="Normal">Normal</option>
                  <option value="Fast">Fast</option>
                  <option value="Maximum">Maximum</option>
                </select>
              </div>
            </div>

            <div className="p-4 border-t border-slate-800 flex justify-end gap-2">
              <button
                onClick={() => setStep('options')}
                className="text-xs text-slate-400 hover:text-white px-4 py-2"
              >
                CANCEL
              </button>
              <button
                onClick={handlePackZip}
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-6 py-2 rounded-xl transition"
              >
                OK
              </button>
            </div>
          </div>
        )}

        {/* Screen 13: Convert to Android Application (Step 1) */}
        {step === 'apk_step1' && (
          <div className="flex flex-col flex-1">
            <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setStep('options')}
                  className="p-1 hover:bg-slate-800 rounded-full text-slate-300 hover:text-white transition"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <h2 className="text-sm font-bold text-white">Convert to Android Application</h2>
              </div>
              <button onClick={onClose} className="text-slate-400 hover:text-white p-1">
                ✕
              </button>
            </div>

            <div className="p-5 space-y-3 flex-1 overflow-y-auto">
              <div>
                <label className="block text-[11px] text-slate-400 font-semibold mb-1">
                  Application Name
                </label>
                <input
                  type="text"
                  value={apkConfig.appName}
                  onChange={(e) => setApkConfig({ ...apkConfig, appName: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-[11px] text-slate-400 font-semibold mb-1">
                  Package Name
                </label>
                <input
                  type="text"
                  value={apkConfig.packageName}
                  onChange={(e) => setApkConfig({ ...apkConfig, packageName: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-xs text-white font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] text-slate-400 font-semibold mb-1">
                    Version Code
                  </label>
                  <input
                    type="text"
                    value={apkConfig.versionCode}
                    onChange={(e) => setApkConfig({ ...apkConfig, versionCode: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2 text-xs text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-slate-400 font-semibold mb-1">
                    Version Name
                  </label>
                  <input
                    type="text"
                    value={apkConfig.versionName}
                    onChange={(e) => setApkConfig({ ...apkConfig, versionName: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2 text-xs text-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] text-slate-400 font-semibold mb-1">
                  Homepage
                </label>
                <input
                  type="text"
                  value={apkConfig.homepage}
                  onChange={(e) => setApkConfig({ ...apkConfig, homepage: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-xs text-white font-mono"
                />
              </div>
            </div>

            <div className="p-4 border-t border-slate-800 flex justify-end gap-2">
              <button
                onClick={() => setStep('options')}
                className="text-xs text-slate-400 hover:text-white px-4 py-2"
              >
                CANCEL
              </button>
              <button
                onClick={() => setStep('apk_step2')}
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-6 py-2 rounded-xl transition"
              >
                NEXT
              </button>
            </div>
          </div>
        )}

        {/* Screen 14: Android App Configuration (Step 2) */}
        {step === 'apk_step2' && (
          <div className="flex flex-col flex-1">
            <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setStep('apk_step1')}
                  className="p-1 hover:bg-slate-800 rounded-full text-slate-300 hover:text-white transition"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <h2 className="text-sm font-bold text-white">Android App Configuration</h2>
              </div>
              <button onClick={onClose} className="text-slate-400 hover:text-white p-1">
                ✕
              </button>
            </div>

            <div className="p-5 space-y-4 flex-1 overflow-y-auto">
              <div className="grid grid-cols-2 gap-3">
                {/* App Icon */}
                <div className="bg-slate-800/80 border border-slate-700 rounded-2xl p-3 flex flex-col items-center text-center">
                  <span className="text-[11px] font-semibold text-slate-300 mb-2">App Icon</span>
                  <div className="w-12 h-12 rounded-xl bg-slate-900 border-2 border-emerald-500 flex items-center justify-center text-2xl shadow-inner mb-1">
                    {apkConfig.icon || '🌐'}
                  </div>
                  <span className="text-[10px] text-emerald-400">Default Icon</span>
                </div>

                {/* Splash Screen */}
                <div className="bg-slate-800/80 border border-slate-700 rounded-2xl p-3 flex flex-col items-center text-center">
                  <span className="text-[11px] font-semibold text-slate-300 mb-2">Splash Screen</span>
                  <div className="w-12 h-12 rounded-xl bg-emerald-800 border border-emerald-500/60 flex items-center justify-center text-white text-xl shadow-inner mb-1">
                    ⚡
                  </div>
                  <span className="text-[10px] text-emerald-400">splash.html</span>
                </div>
              </div>

              <div>
                <label className="block text-[11px] text-slate-400 font-semibold mb-1">
                  Min SDK Version
                </label>
                <select
                  value={apkConfig.minSdkVersion}
                  onChange={(e) => setApkConfig({ ...apkConfig, minSdkVersion: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-xs text-white"
                >
                  <option value="21 (Android 5.0)">21 (Android 5.0)</option>
                  <option value="24 (Android 7.0)">24 (Android 7.0)</option>
                  <option value="26 (Android 8.0)">26 (Android 8.0)</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] text-slate-400 font-semibold mb-1">
                  Target SDK Version
                </label>
                <select
                  value={apkConfig.targetSdkVersion}
                  onChange={(e) => setApkConfig({ ...apkConfig, targetSdkVersion: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-xs text-white"
                >
                  <option value="33 (Android 13)">33 (Android 13)</option>
                  <option value="34 (Android 14)">34 (Android 14)</option>
                  <option value="31 (Android 12)">31 (Android 12)</option>
                </select>
              </div>
            </div>

            <div className="p-4 border-t border-slate-800 flex justify-end gap-2">
              <button
                onClick={() => setStep('apk_step1')}
                className="text-xs text-slate-400 hover:text-white px-4 py-2"
              >
                CANCEL
              </button>
              <button
                onClick={handleStartApkBuild}
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-6 py-2 rounded-xl transition shadow-md"
              >
                BUILD
              </button>
            </div>
          </div>
        )}

        {/* Screen 15: Build APK Progress & Success */}
        {step === 'apk_building' && (
          <div className="p-8 flex flex-col items-center justify-center text-center space-y-4">
            <div className="w-16 h-16 rounded-full border-4 border-emerald-500/20 border-t-emerald-500 animate-spin flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-emerald-400" />
            </div>
            <h3 className="text-base font-bold text-white">Building Android APK</h3>
            <p className="text-xs text-slate-400 max-w-xs">{buildStepText}</p>
            <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
              <div
                className="bg-emerald-500 h-full transition-all duration-300"
                style={{ width: `${buildProgress}%` }}
              />
            </div>
          </div>
        )}

        {step === 'apk_success' && (
          <div className="flex flex-col flex-1">
            <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between">
              <h2 className="text-sm font-bold text-white">Build APK</h2>
              <button onClick={onClose} className="text-slate-400 hover:text-white p-1">
                ✕
              </button>
            </div>

            <div className="p-6 flex flex-col items-center justify-center text-center space-y-4 flex-1">
              <div className="w-16 h-16 rounded-full bg-emerald-950/60 border-2 border-emerald-500 flex items-center justify-center text-emerald-400 shadow-lg shadow-emerald-500/20 animate-bounce">
                <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
              </div>

              <h3 className="text-base font-bold text-white">Build Completed Successfully!</h3>

              <div className="w-full bg-slate-950 p-3 rounded-2xl border border-slate-800 text-left">
                <span className="text-[10px] uppercase font-bold text-slate-500">APK Location</span>
                <p className="text-xs font-mono text-emerald-400 break-all mt-0.5">
                  /storage/emulated/0/ApdWeb/{apkConfig.appName}/app-release.apk
                </p>
              </div>
            </div>

            <div className="p-4 border-t border-slate-800 flex items-center justify-between gap-2">
              <button
                onClick={handleDownloadGeneratedApk}
                className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow"
              >
                <Download className="w-4 h-4" />
                <span>OPEN / GET</span>
              </button>

              <button
                onClick={handleShareApk}
                className="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl border border-slate-700 transition"
                title="Share APK"
              >
                <Share2 className="w-4 h-4" />
              </button>

              <button
                onClick={onClose}
                className="text-xs text-slate-400 hover:text-white px-3 py-2"
              >
                CLOSE
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
