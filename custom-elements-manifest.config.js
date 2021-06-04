/* eslint-disable */
import fs from 'fs';
import path from 'path';
import { customElementsManifestToMarkdown } from '@custom-elements-manifest/to-markdown';

export default {
  plugins: [
    {
      moduleLinkPhase({moduleDoc}) {
        moduleDoc?.declarations?.forEach(declaration => {
          if(declaration.kind === 'class') {
            declaration.members = declaration?.members?.filter(member =>!(member.name === 'scopedElements' || member.name === 'localizeNamespaces'))
          }
        })
      },
      packageLinkPhase({customElementsManifest}) {
        customElementsManifest?.modules?.forEach(mod => {
          if(mod.path.includes('translations') || mod.path.includes('test') || mod.path.includes('.css.') || mod.path.includes('templates')) return;

          const modulePath = path.dirname(mod.path);
          const classes = mod?.declarations?.filter(declaration => declaration.kind === 'class' || declaration.kind === 'mixin');
          classes?.forEach(klass => {
  
            const doc = { 
              modules: [
                {
                  path: mod.path,
                  declarations: [klass]
                }
              ],
            }

            if(!fs.existsSync(`${modulePath}/docs`)) {
              fs.mkdirSync(`${modulePath}/docs`);
            }
            fs.writeFileSync(`${modulePath}/docs/${klass.name}.md`, customElementsManifestToMarkdown(doc));
          });
        });   
      }
    },
  ],
}