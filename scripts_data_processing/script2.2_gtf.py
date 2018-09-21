# to xrisimopoiw
#gtf file : includes only 'transcript' annotations with biotype = 'protein_coding'

# 2nd step split row[8] into substrings

import csv

#data = csv.reader(open("Homo_sapiens.GRCh38.91.gtf"),delimiter="	")
data = csv.reader(open("/home/geo/Desktop/new_HOMO_from_ensembl/Homo_sapiens.GRCh37.75.gtf"),delimiter="	")
file_object = open('/home/geo/Desktop/new_HOMO_from_ensembl/final3_transcript_annotations_gtf_file.txt.csv', 'w' )


lista = ['1','2','3','4','5','6','7','8','9','10','11','12','13','14','15','16','17','18','19','20','21','22','X','Y']	


for row in data:
	if row[0] in lista:
		if (row[2] != 'CDS' and row[2] != 'start_codon' and row[2] != 'stop_codon' and row[2] != 'Selenocysteine' and row[2] != 'exon' and row[2] != 'UTR' and row[8].find("protein_coding") != -1):
		#if (row[2] == 'exon' and row[8].find("protein_coding") != -1):	
		#if ( (row[2] == 'gene' or row[2] == 'transcript' or row[2] == 'exon' or row[2] == 'three_prime_utr' or row[2] == 'five_prime_utr')  and row[8].find("protein_coding") != -1):
			
			my_list = row[8].split(";")
			
			# take out all quote characters
			i=0
			while True:
				my_list[i] = my_list[i].replace('"','')
				i = i+1
				if i == len(my_list):
					break
				
			
			my_list[0] = my_list[0].replace('gene_id','')
			
			if (row[2] == 'gene'):
				my_list[1] = my_list[1].replace('gene_name','')
				element = row[0] + '\t' + row[2] + '\t' + row[3] + '\t' + row[4] + '\t' + row[6] + '\t' + my_list[0] + '\t' + my_list[1] + '\n'
				
			elif ( row[2] == 'transcript' or row[2] == 'UTR' ):
				my_list[2] = my_list[2].replace('gene_name','')
				my_list[5] = my_list[5].replace('transcript_name','')
				my_list[1] = my_list[1].replace('transcript_id','')
				element = row[0] + '\t' + row[2] + '\t' + row[3] + '\t' + row[4] + '\t' + row[6] + '\t' + my_list[0] + '\t' + my_list[2] + '\t' + my_list[1] + '\t' + my_list[5] + '\n'
				
			elif ( row[2] == 'exon'):

				if(my_list[8].find('exon_id') != -1):	#"exon_id" in original file input is either on position 11 or 13 
					my_list[8] = my_list[8].replace('exon_id','')

				else:
					my_list[8] = my_list[10]
					my_list[8] = my_list[8].replace('exon_id','')

				#my_list[11] = my_list[11].replace('exon_id','')	
				my_list[2] = my_list[2].replace('exon_number','')
				my_list[3] = my_list[3].replace('gene_name','')
				my_list[1] = my_list[1].replace('transcript_id','')
				my_list[6] = my_list[6].replace('transcript_name','')

					
				element = row[0] + '\t' + row[2] + '\t' + row[3] + '\t' + row[4] + '\t' + row[6] + '\t' + my_list[0] + '\t' + my_list[3] + '\t' + my_list[1] + '\t' + my_list[6] + '\t' + my_list[8] + '\t' + my_list[2] + '\n'

			#element = row[0] + '\t' + row[2] + '\t' + row[3] + '\t' + row[4] + '\t' + row[6] 

			#for i in my_list:
			#	element = element + '\t' + i
				
			#element = element + '\n'
			
			
			file_object.write(element)


file_object.close()


