
import Constants from 'expo-constants';

// Constants.manifest.releaseChannel;

const environmentProduction = {
    env: 'prod',
    stripeKey: 'prod',
    firebaseConfig: {
        apiKey: "REDACTED",
        authDomain: "REDACTED",
        databaseURL: "REDACTED",
        projectId: "REDACTED",
        storageBucket: "REDACTED",
        messagingSenderId: "REDACTED",
        appId: "REDACTED"
    },
    amplitudeApiKey: '',
};

const environmentDevelopment = {
    env: 'dev',
    stripeKey: 'dev',
    firebaseConfig: {
        apiKey: "REDACTED",
        authDomain: "REDACTED",
        databaseURL: "REDACTED",
        projectId: "REDACTED",
        storageBucket: "REDACTED",
        messagingSenderId: "REDACTED",
        appId: "REDACTED"
    },
    amplitudeApiKey: 'REDACTED',
};

const releaseChannel = Constants.manifest.releaseChannel || '';
let environment;

export default environment = releaseChannel.indexOf('prod') !== -1 ? environmentProduction : environmentDevelopment;
// export default environment = environmentProduction;

// 1. Publish to a prod channel - https://docs.expo.io/versions/v36.0.0/distribution/release-channels/
// 2. Build and test - https://docs.expo.io/versions/v36.0.0/distribution/building-standalone-apps/
// 3. Distribute to the App Store & Google Play Store - https://docs.expo.io/versions/v36.0.0/distribution/uploading-apps/
