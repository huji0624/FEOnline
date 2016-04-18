proj_name="jansson"
config=$1
if [ "$config" == "" ];then
	config="Release"
fi

function buildArch(){
	arch=$1

	echo "[build arch]"$arch

	echo '[clean]'
	rm -rf build
	echo '[clean done]'

	if [ "$arch" == "phone" ];then
		xcodebuild -project $proj_name'.xcodeproj' 
	else
		xcodebuild -project $proj_name'.xcodeproj' -sdk iphonesimulator9.2 -arch $arch VALID_ARCHS=$arch
	fi

	path=`find build | grep "\.a"`

	mv $path "tmplib/"$arch"_"$lib_name
}

lib_name="lib"$proj_name".a"

mkdir tmplib
buildArch "phone"
buildArch "x86_64"
buildArch "i386"

cd tmplib
libs=`ls`
lipo -create $libs -output $lib_name
