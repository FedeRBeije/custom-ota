while getopts d: flag
do
    case "${flag}" in
        d) directory=${OPTARG};;
    esac
done

cd ..
rm -r ./updates/*
mkdir ./updates/$directory/
cp -r ./expo-updates-client/dist/ ./updates/$directory
node ./expo-updates-client/scripts/exportClientExpoConfig.js > ./updates/$directory/expoConfig.json