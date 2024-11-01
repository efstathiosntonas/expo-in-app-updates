import ExpoModulesCore
import StoreKit

public class ExpoInAppUpdatesModule: Module {
    public func definition() -> ModuleDefinition {
        Name("ExpoInAppUpdates")

        AsyncFunction("checkForUpdate") { (promise: Promise) in
            let appId = Bundle.main.infoDictionary?["AppStoreID"] as? String ?? ""
            let appStoreURL = URL(string: "https://itunes.apple.com/lookup?id=\(appId)")!

            let session = URLSession(configuration: .ephemeral)
            session.dataTask(with: appStoreURL) { (data, response, error) in
                if let error = error {
                    promise.reject("ERROR", "Failed to fetch app info: \(error.localizedDescription)")
                    return
                }

                guard let data = data else {
                    promise.reject("ERROR", "No data received from App Store")
                    return
                }

                do {
                    if let json = try JSONSerialization.jsonObject(with: data, options: []) as? [String: Any],
                       let results = json["results"] as? [[String: Any]],
                       let appStoreVersion = results.first?["version"] as? String {
                        let currentVersion = Bundle.main.infoDictionary?["CFBundleShortVersionString"] as? String ?? ""
                        let updateAvailable = appStoreVersion != currentVersion
                        promise.resolve(["updateAvailable": updateAvailable, "storeVersion": appStoreVersion])
                    } else {
                        promise.resolve(["updateAvailable": false])
                    }
                } catch {
                    promise.reject("ERROR", "Failed to parse app info: \(error.localizedDescription)")
                }
            }.resume()
        }

        AsyncFunction("startUpdate") { (promise: Promise) in
            let appId = Bundle.main.infoDictionary?["AppStoreID"] as? String ?? ""

            DispatchQueue.main.async {
                guard let scene = UIApplication.shared.connectedScenes.first as? UIWindowScene,
                      let rootViewController = scene.windows.first?.rootViewController else {
                    promise.reject("ERROR", "Unable to get root view controller")
                    return
                }

                let storeViewController = SKStoreProductViewController()
                let parameters = [SKStoreProductParameterITunesItemIdentifier: appId]

                storeViewController.loadProduct(withParameters: parameters) { (loaded, error) in
                    if loaded {
                        DispatchQueue.main.async {
                            rootViewController.present(storeViewController, animated: true, completion: nil)
                        }
                        promise.resolve(true)
                    } else {
                        let urlString = "https://apps.apple.com/app/id\(appId)"
                        if let url = URL(string: urlString) {
                            DispatchQueue.main.async {
                                UIApplication.shared.open(url, options: [:]) { success in
                                    if success {
                                        promise.resolve(true)
                                    } else {
                                        promise.reject("ERROR", "Failed to open App Store URL")
                                    }
                                }
                            }
                        } else {
                            promise.reject("ERROR", "Invalid App Store URL")
                        }
                    }
                }
            }
        }
    }
}
