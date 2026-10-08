# Managed design system

**Scope:** shared web UI foundations. **Why:** enforce accessible, consistent rendering once.

**DS-01 MUST:** Generic concepts belong in the DS; business compositions stay in features. DS components never import feature contracts, routing, server data or global business state.

**DS-02 SHOULD:** Use DTCG token source with primitive → semantic → optional component layers; Style Dictionary may emit CSS/native outputs. Features consume semantic roles, never raw palette literals.

**DS-03 MUST:** Keep semantic roles consistent across light/dark themes, with system preference and explicit override. Verify contrast for supported theme/brand combinations.

**DS-04 MUST:** Own typography, spacing, layout, focus and motion tokens. Use readable scalable text, logical CSS, container adaptation and reduced-motion alternatives; motion never carries meaning alone.

**DS-05 SHOULD:** Use React Aria Components behind the product API for complex new controls; existing Radix systems remain valid. Simple native elements stay inside DS implementation. Preserve label/error semantics, refs and form integration.

**DS-06 MUST:** Show meaningful component states in Storybook; test interaction/accessibility and representative keyboard/screen-reader behavior. Review visual changes, version breaking APIs and use Changesets when packages release independently.

```tsx
// Feature composition; all rendered primitives come from the DS.
<Stack>
  <TextField {...form.register('name')} label={t('create.name')}
    error={form.formState.errors.name?.message} testId={OrderTestId.NameInput} />
  <Button onPress={submit} isPending={pending} testId={OrderTestId.SaveButton}>
    {t('create.save')}
  </Button>
</Stack>
```

**Check:** disabled/error/loading states, both directions/themes, zoom, keyboard and form focus. **Vary when:** a vetted existing DS can satisfy these controls without a new package. Sources: [DTCG](https://www.designtokens.org/), [React Aria](https://react-spectrum.adobe.com/react-aria/), [WCAG 2.2](https://www.w3.org/TR/WCAG22/).
