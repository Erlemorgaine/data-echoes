for file in *.svg
do
    filename=$(basename "$file" .svg)
    rsvg-convert -h 512 "$filename".svg > "$filename".png
done
