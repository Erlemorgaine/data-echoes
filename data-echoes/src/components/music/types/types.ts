export type FrequencySignal = {
  analyser: AnalyserNode
  data: Float32Array
  filter: BiquadFilterNode
}

export type VizTypes = 'winter' | 'precious'