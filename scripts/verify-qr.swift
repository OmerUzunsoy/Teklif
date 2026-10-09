// Optional macOS QR verification using an independent system decoder.
import Foundation
import ImageIO
import Vision
var results: [String] = []
for file in CommandLine.arguments.dropFirst() {
    let url = URL(fileURLWithPath: file)
    guard let source = CGImageSourceCreateWithURL(url as CFURL, nil),
          let image = CGImageSourceCreateImageAtIndex(source, 0, nil) else {
        throw NSError(domain: "TeklifQR", code: 1, userInfo: [NSLocalizedDescriptionKey: "Image could not be read"])
    }
    let request = VNDetectBarcodesRequest()
    request.symbologies = [.qr]
    try VNImageRequestHandler(cgImage: image).perform([request])
    guard let payload = request.results?.first?.payloadStringValue else {
        throw NSError(domain: "TeklifQR", code: 2, userInfo: [NSLocalizedDescriptionKey: "QR could not be decoded"])
    }
    results.append(payload)
}
let output = try JSONSerialization.data(withJSONObject: results)
print(String(data: output, encoding: .utf8)!)
