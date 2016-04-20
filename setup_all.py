
#copy files
cfiles = {
	"server/game-server/app/game/map/sblock.js":"src/blocks/sblock.js",
	"server/game-server/app/game/map/transaction.js":"src/blocks/transaction.js"
}

def replace(t,tag,totext):
	i = t.find(tag)
	ei = i + len(tag)
	j = t.find(tag,ei)
	target = t[ei:j]
	return t.replace(target,totext)

for fp,tfp in cfiles.items():
	f = file(fp,"r")
	text = f.read()
	f.close()

	totext = replace(text,"//replace","This is auto generate.Do not edit.")

	f = file(tfp,"w")
	f.write(totext)
	f.close()

	print "copy %s => %s ok." % (fp,tfp)
